# Process: Mathematical Foundations

This document describes the algorithmic pipeline that converts a user's payoff intent into three ranked option structures.

## The Core Innovation

Options structure construction is a combinatorial optimization problem. Given a chain of 100–300 listed options, the number of possible multi-leg combinations (varying contract selection, direction, and quantity) is combinatorially explosive. Traders navigate this space by heuristic — choosing familiar patterns rather than systematically searching for the best construction.

Structure Lab replaces heuristic selection with **mixed-integer linear programming (MILP)**. The user specifies a target payoff shape, and the solver finds the combination of listed options that best approximates it subject to cost, delta, leg count, and robustness constraints. The solver then runs three times with different objective weight profiles to produce candidates that are optimal along different dimensions — cost, fit, and robustness. A multi-dimensional scorer evaluates each solution, and a selector picks three distinct representatives for the user.

This is not curve fitting. It is constrained optimization over a discrete decision space (integer contract quantities) with a piecewise-linear objective, solved exactly by branch-and-bound.

## Pipeline Overview

```
User Request
    │
    ▼
┌─────────────────────┐
│ 1. Chain Generation  │  Generate or load option chain for the symbol
│    (fixtures / snap) │  Filter by liquidity (OI, spread)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 2. Target Payoff     │  Piecewise-linear payoff from floor/cap
│    Construction      │  Evaluated at 9 grid points across ±50% spot
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 3. MILP Optimization │  Three passes with different weight profiles:
│    (OR-Tools CBC)    │    Pass 1: Cost-focused (minimize premium)
│                      │    Pass 2: Fit-focused (minimize tracking error)
│                      │    Pass 3: Robustness-focused (minimize vega)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 4. Multi-Dimensional │  Score each solution across 4 dimensions:
│    Scoring           │    cost, simplicity, robustness, liquidity
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 5. Representative    │  Select 3 distinct candidates:
│    Selection         │    cheapest, simplest, most robust
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 6. Explanation       │  Plain-English summary of each candidate
│    Generation        │  Payoff grid, Greeks, warnings
└──────────┘
```

## Stage 1: Option Chain and Liquidity Filtering

The optimizer operates on a set of candidate option contracts. In Phase 1, these are generated synthetically using Black-Scholes pricing with realistic implied volatility skew. In production, they come from delayed market snapshots.

**Black-Scholes pricing** computes theoretical option prices:

```
         d₁ = [ln(S/K) + (r + σ²/2)T] / (σ√T)
         d₂ = d₁ - σ√T

Call:    C = S·N(d₁) - K·e^(-rT)·N(d₂)
Put:     P = K·e^(-rT)·N(-d₂) - S·N(-d₁)
```

Where `S` is spot price, `K` is strike, `T` is time to expiry in years, `r` is the risk-free rate, `σ` is implied volatility, and `N(·)` is the standard normal CDF.

**Greeks** (delta, gamma, vega, theta) are computed analytically from the same model to characterize each contract's sensitivity profile.

**Liquidity filtering** removes contracts that are illiquid or too wide to trade:

- Open interest must exceed a minimum threshold (default: 250 contracts)
- Bid-ask spread as a percentage of mid must be below a maximum (default: 2%)
- Contract type (call/put) is filtered by the template's allowed instruments

A typical liquid equity chain starts with 200+ contracts and filters down to 60–120 candidates.

## Stage 2: Target Payoff Construction

The user's intent is converted into a **piecewise-linear target payoff function** defined by two parameters:

- **Floor** (`floor_pct`): The minimum portfolio value as a percentage move from spot. Example: -10% means the portfolio should not lose more than 10%.
- **Cap** (`cap_pct`): The maximum upside participation. Example: +20% means upside is capped at a 20% gain.

The target payoff per 100 shares (one contract equivalent) is:

```
           ┌ CONTRACT_SIZE × Kf          if S ≤ Kf
Π*(S) =   │ CONTRACT_SIZE × S           if Kf < S < Kc
           └ CONTRACT_SIZE × Kc          if S ≥ Kc

where:
    Kf = S₀ × (1 + floor_pct)      Floor strike
    Kc = S₀ × (1 + cap_pct)        Cap strike
    CONTRACT_SIZE = 100             Shares per contract
```

This creates a **collared linear payoff**: flat below the floor, linear participation in between, and flat above the cap. This shape can represent bullish, bearish, and hedged exposures depending on the floor and cap values.

The target is evaluated at a grid of spot prices spanning ±50% from the current price:

```
S_grid = S₀ × [0.50, 0.70, 0.80, 0.90, 1.00, 1.10, 1.20, 1.30, 1.50]
```

These 9 grid points define where the optimizer must match the target shape.

## Stage 3: MILP Optimization

This is the core of the system. The optimizer finds integer contract quantities that minimize a weighted combination of tracking error, cost, and vega brittleness.

### Decision Variables

For each candidate option `j` in the filtered chain:

| Variable | Type | Range | Meaning |
|----------|------|-------|---------|
| `xⱼ` | Integer | `[-M, M]` | Signed quantity of option `j` (positive = buy, negative = sell) |
| `zⱼ` | Binary | `{0, 1}` | Whether option `j` is used at all (indicator) |
| `y` | Integer | `[0, 100]` | Lots of underlying stock |
| `b` | Continuous | `[0, ∞)` | Cash/bond position |
| `u⁺ᵢ`, `u⁻ᵢ` | Continuous | `[0, ∞)` | Positive and negative payoff deviation at grid point `i` |

Where `M` is the maximum contracts per leg (default: 10).

### Big-M Indicator Constraints

The binary variables `zⱼ` are linked to the quantity variables `xⱼ` via big-M constraints:

```
xⱼ ≤ M · zⱼ       for all j
xⱼ ≥ -M · zⱼ      for all j
```

When `zⱼ = 0`, this forces `xⱼ = 0`. When `zⱼ = 1`, `xⱼ` is free within `[-M, M]`. This allows the solver to count the number of distinct legs used.

### Leg Count Constraint

```
Σⱼ zⱼ ≤ max_legs
```

Limits the total number of distinct option contracts in the solution (default: 3).

### Portfolio Payoff at Each Grid Point

The terminal payoff at grid point `i` (spot price `Sᵢ`) is:

```
Πᵢ = y · CONTRACT_SIZE · Sᵢ + Σⱼ xⱼ · payoff(j, Sᵢ) + b · e^(rT)
```

Where `payoff(j, Sᵢ)` is the intrinsic value of option `j` at expiry when spot is `Sᵢ`:

```
Call payoff:  CONTRACT_SIZE × max(0, Sᵢ - Kⱼ)
Put payoff:   CONTRACT_SIZE × max(0, Kⱼ - Sᵢ)
```

The payoff matrix `payoff(j, Sᵢ)` is precomputed as native floats before the solver runs.

### Tracking Error Decomposition

At each grid point, the deviation from the target is decomposed into positive and negative components:

```
Πᵢ - Π*(Sᵢ) = u⁺ᵢ - u⁻ᵢ       for all i
u⁺ᵢ, u⁻ᵢ ≥ 0
```

The total absolute tracking error is `Σᵢ (u⁺ᵢ + u⁻ᵢ)`.

### Floor and Cap Enforcement

Hard constraints ensure the floor and cap are respected within tolerance:

```
Πᵢ ≥ CONTRACT_SIZE × Kf - ε       for all i where Sᵢ ≤ Kf
Πᵢ ≤ CONTRACT_SIZE × Kc + ε       for all i where Sᵢ ≥ Kc
```

Where `ε = CONTRACT_SIZE × tol_floor_cap` is a small tolerance (default: 1%).

### Slope Constraints (Participation Zone)

Between the floor and cap, the payoff should increase approximately linearly with spot price. Adjacent grid points in this zone are constrained:

```
(1 - slope_tol) × CONTRACT_SIZE × ΔS ≤ Πᵢ₊₁ - Πᵢ ≤ (1 + slope_tol) × CONTRACT_SIZE × ΔS
```

Where `ΔS = Sᵢ₊₁ - Sᵢ` and `slope_tol` is 5% by default. This prevents the optimizer from finding degenerate solutions that match the target at grid points but have pathological behavior between them.

### Delta Band Constraint

The portfolio delta is bounded to stay within a band:

```
δ_lo ≤ y · CONTRACT_SIZE + Σⱼ xⱼ · Δⱼ · CONTRACT_SIZE ≤ δ_hi
```

Default band: `[95, 105]` delta, roughly one-to-one with the underlying.

### Budget Constraint (Optional)

```
y · CONTRACT_SIZE · S₀ + Σⱼ xⱼ · midⱼ · CONTRACT_SIZE + b ≤ budget_max
```

### Vega Accounting

Total portfolio vega is tracked for the brittleness penalty:

```
V = Σⱼ xⱼ · νⱼ · CONTRACT_SIZE
|V| ≥ V   and   |V| ≥ -V       (linearized absolute value)
```

### Objective Function

The solver minimizes:

```
minimize:  λ_error × Σᵢ(u⁺ᵢ + u⁻ᵢ) + λ_cost × cost₀ + λ_brittleness × |V|
```

Where:
- `λ_error` weights tracking error (how closely the structure matches the target shape)
- `λ_cost` weights the upfront premium cost
- `λ_brittleness` weights sensitivity to implied volatility changes

### Three-Pass Strategy

The optimizer runs three times with different weight profiles to explore different regions of the Pareto frontier:

| Pass | λ_error | λ_cost | λ_brittleness | Emphasis |
|------|---------|--------|----------------|----------|
| 1 | 1.0 | 0.08 | 0.3 | Cost-focused |
| 2 | 1.0 | 0.02 | 0.5 | Fit-focused |
| 3 | 1.0 | 0.02 | 1.5 | Robustness-focused |

Each pass uses the CBC branch-and-bound solver with a 10-second time limit. The solver returns either an optimal or feasible solution.

### Why MILP?

Contract quantities must be integers (you can't buy 2.7 contracts). This makes the problem a mixed-integer program. The payoff functions are piecewise-linear, and all constraints are linear in the decision variables, making this a MILP — a problem class with mature, efficient solvers.

The alternative approaches — genetic algorithms, Monte Carlo search, exhaustive enumeration — are either slow, non-deterministic, or intractable at this scale. MILP gives exact optimality guarantees (or bounded-gap feasibility) in seconds.

## Stage 4: Multi-Dimensional Scoring

Each optimizer solution is scored across four dimensions, each normalized to `[0, 1]` where higher is better:

```
cost_score       = max(0, 1 - upfront_cost / max_cost_ref)
simplicity_score = max(0, 1 - (num_legs - 1) / (max_legs_ref - 1))
robustness_score = max(0, 1 - robustness_error / max_robustness_ref)
liquidity_score  = max(0, 1 - avg_spread_pct / max_spread_ref)
```

| Dimension | What it measures | Reference max |
|-----------|-----------------|---------------|
| **Cost** | Upfront premium outlay | $5,000 |
| **Simplicity** | Number of distinct legs | 6 legs |
| **Robustness** | Total tracking error across grid points | $500 |
| **Liquidity** | Average bid-ask spread of selected contracts | 5% |

The **total score** is a weighted combination using template-specific bias weights:

```
total = w_cost × cost + w_simplicity × simplicity + w_robustness × robustness + w_liquidity × liquidity
```

Default weights: cost 30%, simplicity 25%, robustness 25%, liquidity 20%. Templates can override these to reflect their nature — a hedge overlay might weight robustness higher, while a budget tail hedge might weight cost higher.

## Stage 5: Representative Selection

From the pool of scored solutions (typically 3 from the optimizer passes, sometimes fewer after deduplication), the selector picks three distinct representatives:

1. **Cheapest** — highest `cost_score` among unused candidates
2. **Simplest** — highest `simplicity_score` among remaining unused candidates
3. **Most Robust** — highest `robustness_score` among remaining unused candidates

Deduplication ensures each role is filled by a different solution. If the optimizer produced fewer than 3 distinct solutions (some passes converged to the same point), the selector returns only the distinct ones.

## Stage 6: Explanation and Output

Each selected candidate is annotated with:

- **Plain-English explanation**: "This is the cheapest way to get capped upside exposure on AAPL. It uses 3 legs and costs $X. The tradeoff is higher sensitivity to IV changes."
- **Payoff grid**: The portfolio value at each grid point, alongside the target, with absolute error
- **Greeks**: Aggregate delta, gamma, vega, theta for the constructed position
- **Legs table**: Each option contract with action (buy/sell), type, strike, expiry, quantity, and mid price
- **Warnings and maintenance notes**: Conditions that could degrade the structure over time

## Determinism

Given identical inputs (symbol, spot price, template, constraints, seed), the pipeline produces identical outputs. This is guaranteed by:

1. **Seeded chain generation** — the synthetic chain generator uses a deterministic seed
2. **Fixed reference date** — when seeded, expiry dates are computed from a fixed reference date, not `date.today()`
3. **Deterministic solver** — CBC with fixed parameters produces the same solution path
4. **Version-stamped outputs** — every result carries `engine_version` and `catalog_version` for reproducibility audit

## Template Catalog

The system supports multiple structure families, each defined as a template in a YAML catalog. A template specifies:

- Allowed instrument types (calls, puts, underlying)
- Default constraint values (delta band, leg count, floor/cap)
- Scoring bias weights
- View type (bullish, bearish, neutral, hedge)

Phase 1 implements two templates:

| Template | Description | Typical Construction |
|----------|-------------|---------------------|
| `capped_upside_floor` | Participate in upside with defined floor and cap | Long calls + short calls at different strikes |
| `bullish_defined_risk` | Maximum defined risk with leveraged upside | Call spreads, risk reversals |

The full catalog (8 templates) covers stock replacement, covered-call alternatives, bearish defined-risk, hedge overlays, event structures, and tail-hedge budgets.

## Computational Complexity

The MILP has `2N + 4` integer variables and `2N + 2G + 3` continuous variables, where `N` is the number of candidate options after filtering and `G` is the number of grid points. With typical values of `N = 80` and `G = 9`, this is a moderate-scale MILP with ~164 integer variables and ~183 continuous variables.

The CBC solver typically finds an optimal solution in 1–5 seconds. The 10-second time limit ensures bounded response time even for larger chains. Three passes run sequentially, giving a total solve time of 3–15 seconds per request.

The solver runs in a separate process (via `ProcessPoolExecutor`) to avoid blocking the async event loop, allowing the service to handle health checks and concurrent requests during long solves.

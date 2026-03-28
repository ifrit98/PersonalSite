# Structure Lab

Options payoff-engineering platform that constructs optimal multi-leg option structures using mixed-integer linear programming (MILP). Given a market view (bullish, bearish, hedge), Structure Lab generates candidate structures scored across cost, simplicity, robustness, and liquidity — then presents the best three for comparison.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Next.js 15  │────▶│  Express API │────▶│  Python Quant    │
│  React 19    │     │  Port 3001   │     │  FastAPI :8000   │
│  Port 3000   │     │              │     │                  │
│              │     │  Clerk Auth  │     │  OR-Tools MILP   │
│  TanStack    │     │  Drizzle ORM │     │  Black-Scholes   │
│  Recharts    │◀────│  Zod Valid.  │◀────│  Scoring Engine  │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    │  Port 5434   │
                    └──────────────┘
```

**Two-language split:** TypeScript handles the web stack and type-safe API contracts. Python handles quantitative finance (OR-Tools, scipy, numpy) where the library ecosystem is strongest.

## Monorepo Structure

```
structure-lab/
├── apps/
│   ├── api/                 Express API (auth, routes, quant client)
│   └── web/                 Next.js frontend (builder, compare, detail)
├── packages/
│   ├── shared/              Zod schemas + constants (API contracts)
│   └── db/                  Drizzle ORM schema + migrations
├── services/
│   └── quant/               Python FastAPI quant engine
├── fixtures/                Template catalog YAML + fixture snapshots
├── docker-compose.yml       Postgres, Redis, quant sidecar
└── turbo.json               Task pipeline
```

Managed with **Turborepo** + **pnpm workspaces**.

## How It Works

1. User selects a symbol, template (e.g. "capped upside with floor"), and constraints
2. Express API validates the request and forwards to the quant sidecar
3. Quant engine generates a synthetic option chain (Phase 1) or loads a real snapshot
4. **MILP optimizer** runs 3 passes with different objective weight profiles:
   - Cost-focused (minimize premium)
   - Fit-focused (minimize payoff tracking error)
   - Robustness-focused (minimize sensitivity to shocks)
5. **Scorer** evaluates each solution across 4 dimensions (cost, simplicity, robustness, liquidity)
6. **Selector** picks 3 distinct representatives: cheapest, simplest, most robust
7. **Explainer** generates plain-English descriptions for each candidate
8. Results are persisted to Postgres and returned to the frontend
9. User compares candidates side-by-side, then drills into legs, payoff charts, and Greeks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS, Recharts, TanStack Query |
| Auth | Clerk (dev mode: header-based stub) |
| API | Express 4, Zod validation, structured error envelopes |
| Database | PostgreSQL 15, Drizzle ORM, postgres.js driver |
| Quant Engine | FastAPI, OR-Tools CBC solver, scipy, numpy |
| Infra | Docker Compose, Turborepo, pnpm |

## API Endpoints

### Express API (port 3001)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/v1/symbols` | List enabled symbols |
| GET | `/v1/symbols/:symbol` | Symbol details |
| POST | `/v1/synths/find` | Build optimal structures |
| GET | `/v1/structures/:candidateId` | Candidate detail with legs |

### Quant Engine (port 8000)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health + version info |
| POST | `/engine/find` | Run optimizer pipeline |

## Database Schema

```
users ─────────────┐
                    │
symbols ───────────┤
                    ▼
              structure_requests
                    │
                    ▼
            candidate_structures
                    │
                    ▼
              candidate_legs
```

**Core tables:** `structure_requests` → `candidate_structures` → `candidate_legs` with cascading deletes. All IDs are UUIDs. Scores stored as `numeric(18,6)`.

## Templates

Phase 1 supports 2 of 8 planned templates:

| Template | View | Description |
|----------|------|-------------|
| `capped_upside_floor` | Bullish | Participate in upside with defined floor and cap |
| `bullish_defined_risk` | Bullish | Maximum defined risk with leveraged upside |

Full catalog (Phase 2+): `stock_replacement`, `covered_call_alternative`, `bearish_defined_risk`, `hedge_overlay`, `event_structure`, `tail_hedge_budget`.

## Scoring Dimensions

Each candidate is scored 0–1 across four dimensions with template-specific bias weights:

| Dimension | What it measures |
|-----------|-----------------|
| **Cost** | Upfront premium relative to budget |
| **Simplicity** | Fewer legs = higher score |
| **Robustness** | Payoff tracking error under spot/IV shocks |
| **Liquidity** | Average bid-ask spread of constituent options |

The weighted total determines ranking within each role.

## Phase 1 Scope

This is the first vertical slice — fixture data in, three candidates out, viewable in a real UI with auth.

**Included:** Synthetic chain generation, MILP optimization, multi-dimensional scoring, 3-candidate selection, DB persistence, builder form, compare page, candidate detail with payoff charts.

**Not yet included:** Real market data, portfolio tracking, paper trading, challenge leaderboard, Stripe billing, worker queue (BullMQ), WebSocket updates.

## Quick Links

- [Quickstart Guide](QUICKSTART.md) — Get running in 5 minutes
- [Deployment Guide](DEPLOYMENT.md) — Production deployment
- [Design Spec](docs/superpowers/specs/2026-03-20-structure-lab-v1-design.md) — Full product specification
- [Implementation Plan](docs/superpowers/plans/2026-03-20-phase-1-core-slice.md) — Phase 1 task breakdown

## Tests

**Quant engine (35 tests):**
```bash
cd services/quant
python -m pytest tests/ -v
```

Covers: payoff functions (10), fixture generation (6), Black-Scholes pricing (7), MILP optimizer (4), scorer (2), selector (2), FastAPI integration (4).

**TypeScript typecheck:**
```bash
pnpm turbo typecheck
# or per-package:
cd apps/api && npx tsc --noEmit
cd apps/web && npx tsc --noEmit
```

## License

Proprietary — Granite Labs LLC.

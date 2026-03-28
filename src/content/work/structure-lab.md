---
title: "Structure Lab (GEX)"
summary: An options payoff-engineering platform that uses mixed-integer linear programming to construct optimal multi-leg option structures from user-defined intent — replacing heuristic selection with constrained mathematical optimization.
role: Architect, full-stack, quant engine design
status: selective
order: 6
tags: [quantitative finance, optimization, MILP, options, full-stack, Python, TypeScript]
year: "2026"
featured: true
---

Retail and self-directed options traders navigate a vast combinatorial space by pattern matching rather than systematic optimization. For a typical liquid equity with 200 listed options, the number of possible multi-leg constructions is astronomical. Traders choose structures based on familiarity rather than fit, overpaying because they never see the alternatives.

Structure Lab begins where existing tools don't: with intent. The user describes the payoff shape they want — floor, cap, horizon, symbol — and a MILP optimizer (OR-Tools CBC solver) finds the cheapest, simplest, and most robust listed-options structures that approximate it. Three passes with different objective weight profiles explore the Pareto frontier across cost, fit, and robustness, then a multi-dimensional scorer and selector produce exactly three distinct candidates for comparison.

The system is a two-language monorepo (TypeScript web stack + Python quant engine) with Next.js 15, Express, FastAPI, PostgreSQL, and Docker Compose, managed by Turborepo. Every output is deterministic and version-stamped for reproducibility audit.

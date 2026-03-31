---
title: "SwarmOS"
summary: A collective intelligence research platform that coordinates large populations of specialized AI agents to perform continuous, audited scientific research — with content-addressed artifacts, structured claim graphs, separation of duties, and reproducibility by default.
role: Architect, platform design, full-stack
status: active
order: 7
tags: [agent systems, distributed AI, knowledge graphs, TypeScript, infrastructure, reproducibility]
year: "2026"
featured: true
---

Modern research is bottlenecked by fragmented evidence, combinatorial search spaces, reproducibility breakdowns, and human bandwidth constraints. AI agents can help — but only within a system that enforces provenance, verification, and structured reasoning. Without these guardrails, agents amplify noise rather than signal.

SwarmOS treats research as a closed-loop control system: observe, model, propose, test, verify, update — executed by a persistent swarm of specialized agents operating within explicit compute, cost, and risk budgets. Every artifact has a content hash, every claim has evidence, every result has a reproduction bundle, and every verification has a grade. The thesis: research quality scales with the quality of the substrate, not the quantity of agents.

The platform is a TypeScript monorepo (pnpm + Turborepo) with 13 packages spanning program management, artifact lifecycle with content-addressed storage, a structured claim graph with evidence and counterevidence, task state machines, agent registry with lease-based assignment, and a Fastify API gateway with JWT/RBAC/ABAC authentication — all connected by a Redis Streams event bus with CloudEvents envelopes.

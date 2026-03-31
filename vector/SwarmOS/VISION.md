# SwarmOS — Vision (condensed)

## What it is

SwarmOS is a **collective intelligence research platform**: it coordinates large populations of specialized AI agents to run **continuous, audited scientific research**. Research is modeled as a **closed-loop control system** — observe, model, propose, test, verify, update — executed by a persistent swarm rather than ad hoc chat sessions.

The platform targets problems that are **ill-posed, multi-scale, non-stationary, data-hungry, and adversarial**, where naive agent scaling amplifies noise.

## Core principles

1. **Artifact-first** — Content hashing, lineage, and permissions on every durable object; deduplication and audit trails are structural, not optional.
2. **Evidence graphs over chat logs** — Claims live in a **structured claim graph** with evidence, counterevidence, calibrated confidence, and verification grades — not unstructured transcripts.
3. **Separation of duties** — **Proposer ≠ verifier ≠ integrator.** Independent critics, replicators, and arbiters enforce epistemic discipline; self-verification is disallowed by protocol.
4. **Reproducibility by default** — Runs produce **deterministic reproduction bundles** (environment, inputs, hashes) so results can be replayed and challenged.
5. **Budgeted autonomy** — Agents operate under explicit **compute, cost, and risk budgets** with human approval gates where policy requires it.
6. **Continuous evaluation** — Agents must **outperform baselines** to remain active; the substrate rewards measurable improvement, not volume.

## Thesis

**Research quality scales with substrate quality, not agent quantity.** Guardrails (provenance, verification, structured reasoning) are load-bearing; without them, more agents mean more confabulation.

## Research loop (control view)

The swarm cycles through: **observe** the world and corpus → **model** uncertainty and hypotheses → **propose** claims and experiments → **test** with instrumented runs → **verify** under separation of duties → **update** the graph and artifact store. Events flow through a durable bus so the loop is observable and replayable.

## Agent model (high level)

- **Specialized roles** — Distinct agent types for proposal, critique, replication, integration, and orchestration.
- **Lease-based assignment** — Tasks are acquired via **exclusive leases** with heartbeating; stale leases recover for fault tolerance.
- **Task state machines** — Explicit states, retries, and approval gates tie human oversight to machine execution.
- **Registry** — Agents register capabilities and health; orchestration matches work to eligible agents under policy.

## Technical substrate (architecture summary)

- **Monorepo** — TypeScript, **pnpm workspaces**, **Turborepo**; **13 packages** across services and shared libraries.
- **Data** — **PostgreSQL** with **pgvector** for embeddings where needed; **Drizzle ORM** for typed access.
- **Events** — **Redis Streams** carrying **CloudEvents**-style envelopes for cross-service integration.
- **Objects** — **MinIO/S3**-compatible object storage for large artifacts; content-addressed lifecycle (upload, lineage, permissions).
- **API** — **Fastify** gateway; **JWT** authentication with **RBAC/ABAC** for fine-grained authorization.
- **Scale of surface** — On the order of **30+ authenticated HTTP endpoints** spanning programs, artifacts, claims, tasks, agents, and verification flows.

## Problem class

SwarmOS is purpose-built when: evidence is fragmented; search spaces are combinatorial; reproducibility breaks across teams; human bandwidth is the bottleneck; and adversarial or strategic behavior can poison naive pipelines. The platform makes **auditability and falsifiability** first-class.

## Non-goals (implicit)

SwarmOS is not “chat with many bots.” It is not a generic RAG wrapper. It is a **research substrate** where **claims must be backed, runs must be bundled, and verifiers must be independent.**

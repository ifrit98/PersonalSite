# SwarmOS — README (condensed)

## Overview

**SwarmOS** is a **collective intelligence research platform** in TypeScript. It coordinates specialized AI agents to perform **continuous, audited scientific research** with:

- Content-addressed **artifacts** (hashing, lineage, permissions)
- A **structured claim graph** (evidence, counterevidence, verification grades)
- **Separation of duties** (proposer ≠ verifier ≠ integrator)
- **Reproduction bundles** for deterministic replay
- **Budgeted autonomy** (compute / cost / risk) and approval gates
- **Continuous evaluation** against baselines

Events integrate services via **Redis Streams** and **CloudEvents**-style envelopes.

## Repository shape (conceptual)

Typical monorepo layout under **pnpm + Turborepo**:

- **`apps/`** — Deployable services (e.g. API gateway, workers)
- **`packages/`** — Shared domain libraries (artifact client, claim graph types, auth helpers, event schemas, etc.)

**13 packages** span program management, artifact lifecycle, claim graph, task FSMs, agent registry, API surface, and cross-cutting concerns.

## Services & responsibilities (summary)

| Concern | Role |
|--------|------|
| **API gateway (Fastify)** | HTTP API, authn/z, request validation, routing to domain logic |
| **PostgreSQL + pgvector** | Relational data, embeddings where needed |
| **Drizzle ORM** | Schema-as-code, migrations, type-safe queries |
| **Redis Streams** | Durable event bus between services |
| **MinIO / S3** | Large blobs, multipart upload, content-addressed storage |
| **Auth** | JWT issuance/validation; RBAC + ABAC policy hooks |

## Domain modules (logical)

1. **Programs** — Research programs, scopes, and governance.
2. **Artifacts** — Upload, deduplication by hash, lineage, ACLs.
3. **Claim graph** — Claims, edges to evidence/counterevidence, confidence, verification records.
4. **Tasks** — State machine, retries, human approval transitions.
5. **Agents** — Registry, capabilities, lease acquisition, heartbeats, baseline metrics.
6. **Runs** — Bundled execution metadata for reproducibility.

## API reference (condensed)

The gateway exposes **30+ authenticated endpoints** (exact paths live in the service router), grouped roughly as:

- **Health / meta** — Liveness, version, OpenAPI where published
- **Auth** — Login/token refresh, session introspection where applicable
- **Programs** — CRUD, listing, membership
- **Artifacts** — Initiate multipart upload, complete upload, fetch by hash/id, lineage
- **Claims** — Create/link evidence, fetch subgraph, attach verification
- **Tasks** — Create, transition state, lease acquire/release/heartbeat
- **Agents** — Register, update status, metrics for evaluation

All mutating routes require appropriate **JWT + RBAC/ABAC** scopes.

## Operations notes

- Run with **pnpm** at repo root; use **Turborepo** filters for targeted builds.
- Local stacks typically include **Postgres**, **Redis**, and **MinIO** (e.g. Docker Compose).
- Ingest and embedding pipelines (if present) consume **artifact** and **claim** APIs under the same auth model.

## Related docs

- See **`VISION.md`** in this folder for principles, the research control loop, and agent model detail.

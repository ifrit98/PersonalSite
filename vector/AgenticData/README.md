# Agentic Data — README

Enterprise Context Graph & Agentic Retrieval Planner. A system that turns fragmented enterprise knowledge (PRs, incidents, decisions, tickets, deployments, Slack threads) into a temporal, permissioned context graph, then retrieves precisely the evidence an AI agent needs through an iterative, budget-aware retrieval loop.

This is not RAG. It is a multi-store query engine where relevance is defined by causality, versioning, and organizational state rather than vector similarity alone.

## Architecture

Four data stores, each for what it does best:

- PostgreSQL: Source of truth, OLTP, ACLs — 21 tables covering COs, entities, edges, ACLs, audit trails, segments, embeddings
- OpenSearch: Hybrid lexical + dense vector search — co_segments_v1 index with KNN vectors (HNSW, cosine)
- Neo4j: Causal and temporal graph traversals — CO nodes, Entity nodes, 35 typed edge relationships
- S3/MinIO: Raw payload storage — original documents, attachments, diffs

FastAPI with 27 endpoints, SQLAlchemy 2 async ORM, JWT authentication with RBAC, rate limiting, Docker Compose.

## Core Concepts

### Context Objects (COs)

The atomic unit of institutional knowledge. Types include: pull_request, incident, rca, decision, meeting, ticket, deployment, alert, chat_thread, and more. Each has time bounds (event_start, event_end), validity (valid_from, valid_to, status: current/superseded/deprecated/reverted), actors, entity mentions, multi-resolution summaries, permissions (ACL ID, sensitivity level), and source provenance.

### 35 Typed Edges

Directional, confidence-scored relationships between COs, entities, and notes:
- Causal: root_caused_by, triggers_incident, introduces_issue, fixes_issue, contributes_to, mitigates
- Decisional: decides, rationale_for, approves, rejects, accepts_risk, sets_policy
- Lifecycle: supersedes, deprecated_by, reverted_by, implements, invalidated_by
- Structural: part_of, references, mentions, summarizes, same_as
- Customer: requested_by_customer, impacts_customer, escalated_by

Each edge carries confidence (0.0-1.0), provenance method, evidence spans, and validity windows.

### Agentic Retrieval

An iterative control loop (not a single query):
1. Resolve entities from hints
2. Hybrid candidate search (lexical + dense, RRF fusion)
3. Graph expansion (multi-hop traversal via typed edges)
4. Rerank evidence nodes
5. Sufficiency check with five-component scoring (coverage, recency, authority, diversity, completeness)
6. Stop when sufficient, budget exhausted, or diminishing returns — else refine and iterate

Five intent-driven strategies: Causal Chain (debug/root_cause), Current State + Deltas (decision rationale), Timeline Reconstruction (impact analysis), Precedent Search (policy), Hybrid (general).

## API Reference

### Ingestion
- POST /ingest/context_object — Full pipeline: persist, extract edges, index, graph sync
- POST /ingest/entity — Create an entity
- POST /ingest/edge — Create an edge
- POST /ingest/note — Create a note

### Retrieval
- POST /retrieve/evidence_pack — Returns structured evidence pack with causal chains, timeline, contradictions, excerpts, confidence scores, and retrieval trace

### Graph Queries
- POST /graph/traverse — Expand from seed nodes by typed edges
- POST /graph/subgraph — Extract subgraph among node set
- POST /graph/root_cause_chain — Trace causal chain from incident (up to 4 hops)
- POST /graph/supersession — Follow supersession chain to current version
- POST /graph/decision_chain — Decision rationale chain for a service

### Connectors
- POST /connectors/{source}/sync — GitHub, Jira, PagerDuty sync

### Notes (Truth Maintenance)
- GET /notes/by_entity — Current canonical notes
- POST /notes/supersede — Mark superseded
- POST /notes/deprecate — Mark deprecated/disputed
- POST /notes/suggest_update — Suggest update from new evidence
- POST /notes/approve_update — Approve/reject suggested update
- POST /notes/verify — Mark as recently verified

### Audit
- GET /audit/retrieval_runs — List retrieval runs with per-iteration step details

### Jobs
- POST /jobs/validity_check — Expire past-due notes/COs
- POST /jobs/reconsolidation — Detect contradictions in recently ingested COs

## Authentication & Security

JWT authentication (PyJWT, HS256), rate limiting (100 req/min), CORS middleware, non-root Docker container, request logging with correlation IDs. Data classification tiers (public_internal through restricted) with ACL enforcement.

## Stats

- 27 API routes
- 21 Postgres tables
- 35 typed edge types
- 315 tests (all mocked, no Docker required)
- 5 retrieval strategies
- 5 sufficiency scoring dimensions
- 3 source connectors (GitHub, Jira, PagerDuty)

## Tech Stack

Python 3.11+, FastAPI, SQLAlchemy 2 (async), PostgreSQL, OpenSearch, Neo4j, S3/MinIO, Docker Compose, PyJWT, ruff (linting), pytest.

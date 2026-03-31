---
title: "Agentic Data"
summary: An enterprise context graph and agentic retrieval planner that normalizes fragmented institutional knowledge into typed, timestamped, permissioned Context Objects linked by 35 edge types — then retrieves precisely the evidence an AI agent needs through an iterative, budget-aware retrieval loop with causal graph traversal and sufficiency verification.
role: Architect, platform design, full-stack
status: active
order: 8
tags: [enterprise AI, knowledge graphs, retrieval, Python, FastAPI, Neo4j, OpenSearch, infrastructure]
year: "2026"
featured: true
---

Enterprise knowledge is dying. Every organization generates a continuous stream of institutional knowledge — pull requests, incident timelines, RCA documents, architecture decisions, customer escalations, deployment logs. The connections between them live only in people's heads. When those people leave, the connections disappear. The organization retains its documents but loses its understanding.

Agentic Data captures those connections as a graph of typed, timestamped, permissioned Context Objects linked by 35 edge types spanning causal, decisional, lifecycle, structural, and customer relationships. Instead of embed-and-retrieve RAG, the system runs an iterative agentic retrieval loop: interpret the task, select a strategy, search with hybrid lexical + dense fusion, expand through the graph via typed edges, rerank by five-component sufficiency scoring, and stop when the evidence threshold is met or the budget is exhausted.

The platform uses four data stores each for what it does best: PostgreSQL (21 tables, source of truth), OpenSearch (hybrid search with KNN vectors), Neo4j (causal/temporal graph traversals), and S3/MinIO (raw payloads). 27 FastAPI endpoints, 315 tests, JWT authentication with RBAC, and a self-correcting canonical memory layer with truth maintenance — supersession chains, deprecation markers, contradiction detection, and reconsolidation loops.

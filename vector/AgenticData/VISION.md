# Agentic Data — Vision

## The Problem

Enterprise knowledge is dying. Every organization generates a continuous stream of institutional knowledge — pull requests, incident timelines, RCA documents, architecture decisions, customer escalations, policy changes, deployment logs, design reviews, on-call handoffs. These artifacts are scattered across GitHub, Jira, Slack, Confluence, PagerDuty, ServiceNow, Salesforce, and dozens more systems.

The connections between them — this PR caused that incident, which led to this RCA, which changed this decision, which was later reverted — live only in people's heads. When those people leave, rotate teams, or simply forget, the connections disappear. The organization retains its documents but loses its understanding.

This is not a search problem. You can find the documents. What you can't find is the meaning between them.

## The Thesis

Retrieval is not a feature of an AI agent. It is the core product.

If you buy the "context flywheel" thesis — that AI systems get better as they accumulate and retrieve more context — then the thing that decides whether trillions of tokens become an asset or a landfill is the retrieval layer.

The retrieval layer we have today (RAG: embed, top-k, stuff into prompt) is fundamentally insufficient for enterprise knowledge because:

- Documents are not the unit of knowledge. Events are. A PR, an incident, a decision — these are episodes that happened at a specific time, involved specific actors, and had specific consequences.
- Similarity is not the definition of relevance. Causality, versioning, and organizational state are. When you ask "why did the payment service go down?", the answer is a causal chain through time, not the 10 most semantically similar paragraphs.
- Retrieval is not a single call. It is an iterative control loop that tries to reach an information state. The system should plan what evidence it needs, search for it, evaluate what's missing, expand through graph traversal, and stop when it has enough — or admit that it doesn't.

## The Approach

Agentic Data implements three interlocking ideas:

### 1. An Event-Sourced Context Graph

Every piece of enterprise knowledge is normalized into a Context Object — a typed, timestamped, permissioned event with actors, entities, summaries, provenance, and validity windows. Context Objects are linked by 35 typed edges spanning causal, decisional, lifecycle, structural, and customer relationships.

This is a knowledge graph because enterprise relevance is relational and temporal, and you need a substrate where relational and temporal relevance is even representable. You can't answer "what chain of decisions led to this vulnerability?" with cosine similarity.

### 2. Multi-Resolution Memory

Raw data enters at full fidelity, then exists at multiple levels of abstraction:

- Raw: immutable original documents in object storage
- Episodic: chunked and embedded segments indexed for hybrid search
- Canonical: structured Notes that represent "what we believe now" — editable, version-tracked, with evidence citations and confidence scores

The canonical layer is the key innovation. It is self-correcting: when new evidence contradicts existing notes, the system detects the conflict and initiates reconsolidation. Old truths are not deleted but superseded, maintaining a full audit trail of how understanding evolved.

### 3. Agentic Retrieval

Instead of embed-and-retrieve, the retrieval planner runs an iterative control loop:

1. Interpret the task — extract intent, entities, temporal constraints, evidence requirements
2. Select a retrieval strategy — causal chain for debugging, current-state-plus-deltas for decision rationale, timeline reconstruction for impact analysis
3. Generate candidates — hybrid lexical + dense vector search with RRF fusion
4. Expand through the graph — multi-hop traversal via typed edges, following causal chains, supersession paths, decision rationales
5. Rerank and score — five-component sufficiency scoring (coverage, recency, authority, diversity, completeness)
6. Check sufficiency — stop when the evidence threshold is met, the budget is exhausted, or returns diminish
7. Assemble an evidence pack — minimal, token-budgeted, with provenance, contradictions flagged, confidence scored

This is the retrieval equivalent of a database query planner. It doesn't just find similar things. It hunts for a sufficient evidence graph.

## Design Philosophy

- Relevance is not similarity. Two documents can be semantically identical and one can be wrong (superseded, reverted, deprecated). Relevance is defined by causality, temporal validity, authority, and organizational state.
- Permissions are not a bolt-on. ACL filtering happens before any model sees any content. Graph traversals cannot leak restricted nodes.
- Memory must be self-correcting. Truth maintenance — supersession chains, deprecation markers, contradiction detection, reconsolidation loops — separates institutional memory from institutional hallucination.
- Don't just retrieve more. Aggressive reranking, minimal context packaging, evidence budgets, and sufficiency-based stop conditions are architectural requirements.
- The graph is the product. The context graph is the durable asset that compounds over time. Every ingested document makes it richer. Every query validates or challenges existing connections.

## Goals

Near-term: Replace "ask the person who was there" with "ask the system, and it will trace the evidence chain for you." Make knowledge transfer continuous, not episodic. Provide auditable answers with citations, contradiction flags, and confidence scores.

Long-term: Serve as the institutional memory layer for any AI agent operating in enterprise contexts. Enable proactive knowledge maintenance. Scale to trillions of tokens without degrading retrieval quality.

## What This Is Not

- Not a chatbot — it is a retrieval engine that assembles evidence packs.
- Not a data warehouse — it preserves causal structure and temporal validity.
- Not a traditional knowledge graph — it is automatically maintained with confidence scores and validity windows.
- Not RAG — it is a query engine using similarity as one signal among many, combined with graph traversal, temporal filtering, authority ranking, and sufficiency verification.

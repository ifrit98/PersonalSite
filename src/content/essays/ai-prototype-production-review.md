---
title: "The Five Questions I'd Resolve Before Taking an AI Prototype into Production"
author: Jason St George
kind: architecture-note
status: draft
excerpt: "A production review should clarify the decision, the state, the authority, the recovery path, and the evidence — not merely choose a model."
relatedWork:
  - label: Secure ML architecture
    href: /work/secure-ml-architecture
  - label: Adversarial storage and verification
    href: /work/adversarial-storage-protocol
sources:
  - label: "Anthropic — Building effective agents"
    href: https://www.anthropic.com/engineering/building-effective-agents
  - label: "Google SRE — Handling Overload"
    href: https://sre.google/sre-book/handling-overload/
  - label: "NIST — AI Risk Management Framework"
    href: https://www.nist.gov/itl/ai-risk-management-framework
---

A working demo answers a narrow question: can this combination of model, context and tools produce a useful result along the path we just showed?

That is worth knowing. It is not the same as knowing whether the system should be allowed to operate.

The next engineering commitment is often described as “productionizing the prototype,” as though the architecture had been settled and only the packaging remained. I would begin by making that assumption explicit. The review should determine which parts of the demonstration are reliable foundations and which were temporary conveniences.

Before choosing more infrastructure or a more capable model, I would want five questions answered.

## 1. What decision are we actually automating?

Consider a hypothetical customer-support assistant. It reads an order, explains a policy and proposes a refund. The demonstration looks like one conversation. The operating system contains several different decisions: retrieving the right account, interpreting the request, determining eligibility, selecting an amount, authorizing a financial action and reporting what happened.

Those decisions do not necessarily belong to the same component, or require the same degree of model discretion.

I would ask the team to draw the smallest useful workflow and label each step. Which steps require interpretation? Which are ordinary business rules? Which merely retrieve data? Which create an external effect? What would the simplest acceptable system do without an open-ended agent loop?

Anthropic's engineering guidance makes a useful distinction between predefined workflows and agents that direct their own processes, and recommends starting with simpler approaches before adding complexity. That is a useful design default, not a prohibition on agents. [1]

The review should leave us with a statement more precise than “the assistant handles refunds.” For example: the model interprets the request and drafts a response; a policy service determines eligibility; an authorized workflow executes an approved action.

The point is not to make the model unimportant. It is to know exactly which uncertainty the model is being asked to resolve.

## 2. Where do state and authority live?

The assistant may discuss an order in a conversation. The order still needs an authoritative record. A plausible statement that a refund has been issued is not the same thing as a committed refund transaction.

I would want the team to distinguish what the model has read, what it has inferred, what it has proposed and what the system has actually done.

Then I would trace authority. Who may read which account? Who may approve an action? Does a tool invocation carry an identity and permission boundary, or merely a set of arguments? Can retrieved text alter that boundary? What happens when the model's context conflicts with the current system of record?

A useful architecture makes these distinctions visible enough that they can be tested. A natural-language instruction saying “never do the wrong thing” is not a substitute for an execution path that refuses unauthorized actions.

The same question applies to an internal knowledge assistant. A relevant answer is not sufficient when the supporting document belongs to another tenant, has been superseded, or is not available to the person asking. Retrieval quality and authority have to be considered together.

My desired output from this part of the review is a simple state-and-authority map: the records that matter, the component responsible for each, the permitted transitions and the identity under which each action occurs.

## 3. What happens after the system has done only part of the job?

Return to the hypothetical refund. The external service accepts the action, but its response is delayed. The assistant sees a timeout. Should it try again?

The answer cannot come from the model's confidence. It depends on the transaction semantics and what the system can establish about the first attempt.

I would ask the team to walk through a few deliberately inconvenient cases. A worker restarts after an action but before recording its result. Two workers act on the same request. An upstream system is unavailable. A model output fails validation. A user changes their instruction after the process has begun. The action succeeds, but the final message does not reach the user.

Which of these cases can be retried safely? Which require checking authoritative state? Which need compensation, reconciliation or a human decision? What remains visible to the operator?

Retry behavior also has a resource cost. Google's SRE guidance describes how retries can amplify overload and discusses bounding them rather than treating every failure as a reason to issue more work. [2]

The aim is not an elaborate distributed system for its own sake. It is a small, explicit recovery model appropriate to the consequences of the action. For some products, the right answer is to stop early and ask a person. For others, the workflow needs durable state and more careful execution semantics.

Either answer can be defensible. An undocumented assumption that a timeout means “nothing happened” is what the review should expose.

## 4. What have we measured under the conditions that matter?

A useful evaluation should correspond to a decision we are prepared to make. “The answers looked good” leaves too much unspecified.

I would first define the outcome of the complete workflow. Did it retrieve the correct record? Respect permissions? Produce an acceptable answer? Execute only the authorized action? Finish within the operating budget? Leave enough evidence to diagnose a failure?

Then I would separate the measurements. A model-level evaluation can help select a component. A workflow test examines the assembled behavior. An operating test examines resource limits, dependencies and recovery. None automatically replaces the others.

This is consistent with NIST's broader risk-management emphasis on context, measurement and management. The specific review questions here are a proposed engineering method, not a claim of NIST certification or a required implementation of its framework. [3]

For a local or private deployment, I would also test the actual boundary. Can the required artifacts be installed and updated there? Does the system behave acceptably with the available memory, compute and connectivity? Does it fail clearly when a dependency is absent? Does its measured performance include the retrieval, validation and tool work around inference?

For cost, I would prefer an operating estimate tied to a useful completed workflow: model calls, retrieval, repeated attempts, supporting services and the human work needed when automation stops. The calculation should identify its assumptions instead of turning one successful demonstration into a monthly forecast.

The output is not necessarily a large benchmark suite. It is the smallest set of observations strong enough to support the next commitment.

## 5. What evidence would make us ship, constrain or stop?

An architecture review should not exist to decorate a decision already made.

Before the next experiment, I would write down what its results could change. A successful test might justify a limited rollout. A mixed result might justify a narrower action set, additional human approval or a different architecture. An unsuccessful result might mean the current approach is not worth extending.

These alternatives should be explicit enough that the team can distinguish learning from reinterpretation after the fact.

For the hypothetical support system, we might permit drafting but not execution, restrict it to a known set of requests, or release it to a small authorized population while examining defined failures. The correct choice depends on the evidence and consequences, not a universal preference for maximum autonomy.

I would also assign ownership. Who decides a release is acceptable? Who can disable an action? Who reviews failures? What event prompts reconsideration? What is the fallback while the system is unavailable?

A clear answer is sometimes “we are not ready to automate this part.” That can be the most valuable result of the review when it prevents a larger commitment to an unsuitable architecture.

## What the review should leave behind

The deliverable is not a list of preferred tools. It is a decision package: a system model, explicit constraints, a prioritized set of risks, the evidence behind the recommendations, and a bounded next step.

Sometimes that next step is implementation. Sometimes it is one experiment. Sometimes it is reducing the scope until the system can be understood and operated responsibly.

The recurring question is whether the architecture makes its own assumptions visible. A useful demo shows a path that works. A useful review clarifies the conditions under which we have reason to trust that path—and what happens outside them.

---

**Proposed closing CTA:** I work with technical teams on focused AI and distributed-systems architecture reviews. Bring the decision, the constraints and the evidence available so far. [Link to the verified engagement route when published.]

### Sources

[1] Anthropic, *Building effective agents*: https://www.anthropic.com/engineering/building-effective-agents . Supports the limited distinction between workflows and agents and the simpler-first principle.

[2] Google, *Site Reliability Engineering*, “Handling Overload”: https://sre.google/sre-book/handling-overload/ . Supports the limited discussion of retry amplification and bounded retry behavior.

[3] NIST, *AI Risk Management Framework*: https://www.nist.gov/itl/ai-risk-management-framework . Supports the general context/measurement/management framing, not the authorship or validation of the five-question method.

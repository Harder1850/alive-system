# Phase 37 — Orchestration

## Status
**Rules-only phase.**  
No execution, no memory mutation, no tool invocation.

---

## Purpose

Phase 37 defines the **Orchestration Layer** of ALIVE.

Its primary role is **authorization and denial**: deciding whether anything is allowed to happen at all.

Coordination, sequencing, and routing are subordinate to this gating function.

Phase 37 functions as a **gatekeeper**, not a planner or performer.

Silence, deferral, or idling are valid outcomes.

---

## Core Responsibility

Phase 37 answers the question:

> **“Given this intent and this context, what should happen next, by whom, and in what order?”**

It does **not** decide truth, perform work, or execute actions.

---

## Inputs

Phase 37 may receive only the following inputs:

1. **Validated Intent**  
   From Phase 35 (Intent Routing)

2. **Active Context Snapshot**  
   From Phase 36 (Context Management)

3. **Capability Registry**  
   A static description of available subsystems, tools, models, or agents

4. **Constraints**
   - time
   - cost
   - permissions
   - scope
   - user confirmation requirements

5. **Signals**
   - success / failure indicators
   - availability status
   - partial results (descriptive only)

No raw user input is permitted.

---

## Resource Gating (Mandatory)

Orchestration **cannot occur** unless required gates pass.

Gates may include:
- **Time / Cooldowns** — throttling based on recency or frequency
- **Cost or Token Budgets** — preventing resource exhaustion
- **Concurrency Limits** — avoiding parallelism overload
- **Priority Decay** — deprioritizing stale or low-value requests
- **Explicit User Confirmation** — requiring human authorization

**No gate → no orchestration.**

Gates are evaluated **before** any planning, routing, or coordination occurs.

---

## Outputs

Phase 37 outputs are limited to the following **explicit outcomes** (enum-style):

- **IDLE** — no action authorized; system remains dormant
- **DEFER** — request postponed pending gate clearance or changed conditions
- **CLARIFY** — insufficient information; escalation to upstream phase or user required
- **PLAN** — authorization granted; routing and sequencing instructions generated
- **DELEGATE** — task routed to specific capability or subsystem
- **ABORT** — request denied due to constraint violation or safety concern

**These are authorizations or denials, not actions.**

No free-form orchestration prose is allowed beyond these named outcomes.

All outputs must be:
- Declarative
- Non-executable
- Auditable
- Reversible

---

## Explicit Non-Responsibilities (Hard Limits)

Phase 37 **must never**:

- Execute code
- Invoke tools or APIs
- Perform research
- Generate long-form reasoning
- Write to memory
- Modify context
- Persist identity or beliefs
- Decide correctness or truth
- Perform optimization beyond routing and sequencing

**Absolute Prohibitions (Reinforced):**

Phase 37 must never contain or produce:
- Code
- Pseudocode
- Algorithms
- State machines
- Scheduling logic
- Heuristics
- Tool references

Phase 37 remains **rules-only.**

Any violation constitutes an architectural breach.

---

## Orchestration Principles

### 1. Separation of Concerns
Orchestration is coordination only.
Execution belongs exclusively to Phase 38.

### 2. Minimal Assumption
Phase 37 must assume uncertainty unless explicitly resolved upstream.

### 3. Conservative Default
When unclear, Phase 37 must:
- pause
- ask for clarification
- defer
- escalate to human review

### 4. Reversibility
All orchestration decisions must be undoable.

---

## Relationship to Models and Tools

LLMs, tools, and services are treated as **capabilities**, not authorities.

Phase 37 may:
- Route tasks based on known strengths and weaknesses
- Use multiple capabilities in parallel
- Cross-check outputs across different systems

Phase 37 must **never** trust a single model implicitly.

**Critical Boundaries:**

Phase 37 **may not evaluate**:
- Correctness of outputs
- Truth or factual accuracy
- Quality or semantic validity

Phase 37 **only routes, sequences, or escalates.**

Any verification or reasoning about output content happens **outside this phase**.

---

## Failure Handling

Failure is an acceptable outcome.
Silent failure is not.

Phase 37 must surface:
- uncertainty
- conflicts
- constraint violations
- incomplete information

---

## Architectural Placement

Phase 37 operates strictly between:

- **Phase 36 — Context Management**
- **Phase 38 — Execution**

It may not access memory (Phase 34) or reinterpret intent (Phase 35).

---

## Mental Model

- Phase 35: *What is being asked?*
- Phase 36: *What is relevant right now?*
- **Phase 37: *Who should do what, and in what order?***
- Phase 38: *Do it.*

---

## Rationale

This phase exists to prevent:
- runaway execution
- over-reliance on single models
- hidden side effects
- unbounded autonomy

Phase 37 enables:
- scalable intelligence
- multi-model coordination
- human-in-the-loop safety
- efficient resource use

---

## Anti-Goal

Phase 37 is **not intelligent, creative, or insightful.**

Its function is to decide **whether intelligence should be invoked at all.**

Phase 37 does not:
- Improve plans
- Optimize strategies
- Generate novel solutions
- Exhibit reasoning or judgment beyond rule enforcement

**Any attempt to increase "smartness" here is a violation.**

This phase is intentionally constrained to gating and routing only.

---

## Implementation Notes

Phase 37 is intentionally defined before execution to ensure:
- safety-first design
- clear boundaries
- auditability
- long-term maintainability

No implementation should proceed without this phase being respected.

---

## Exit Criteria

Phase 37 is considered complete when:
- orchestration decisions are explicit
- execution remains external
- constraints are enforced
- plans are auditable and reversible
docs(phase37): define orchestration rules and boundaries

# Phase 37 — Orchestration

## Status
**Rules-only phase.**  
No execution, no memory mutation, no tool invocation.

---

## Purpose

Phase 37 defines the **Orchestration Layer** of ALIVE.

Its sole responsibility is to **coordinate**, **sequence**, and **route** work across
available capabilities in service of an approved intent, under explicit constraints.

Phase 37 functions as a **conductor**, not a performer.

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

## Outputs

Phase 37 outputs **plans**, not actions.

Allowed output forms include:

- Task decomposition plans
- Routing decisions
- Sequencing instructions
- Parallelization strategies
- Escalation or deferral requests
- Abort or pause decisions

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

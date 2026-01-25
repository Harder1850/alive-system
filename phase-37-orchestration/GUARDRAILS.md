# Phase 37 — Orchestration
## GUARDRAILS (Hard Constraints)

**Status:** ENFORCED  
**Scope:** Phase 37 only  
**Authority:** Architectural / Constitutional

This document defines non-negotiable constraints governing Phase 37.  
Violation of any SHALL / SHALL NOT clause constitutes an architectural breach.

---

## 1. Core Authority

### SHALL

- Phase 37 SHALL function as a **gatekeeper**.
- Phase 37 SHALL decide whether any cognition, delegation, or execution is **permitted at all**.
- Phase 37 SHALL treat intelligence as a **scarce resource**.

### SHALL NOT

- Phase 37 SHALL NOT behave as a planning, reasoning, or optimization engine.
- Phase 37 SHALL NOT attempt to improve, enhance, or replace downstream intelligence.

---

## 2. Scope of Responsibility

### SHALL

Phase 37 SHALL operate strictly between:
- **Phase 36 (Context)**
- **Phase 38 (Execution)**

Phase 37 SHALL restrict itself to authorization, denial, sequencing permission, or deferral.

### SHALL NOT

- Phase 37 SHALL NOT reinterpret intent (Phase 35 responsibility).
- Phase 37 SHALL NOT access or mutate memory (Phase 34 responsibility).
- Phase 37 SHALL NOT bypass any phase boundary.

---

## 3. Resource Gating (Mandatory)

### SHALL

- Phase 37 SHALL enforce resource gates **before** authorizing any orchestration.
- Phase 37 SHALL deny or defer orchestration if any required gate fails.
- Phase 37 SHALL allow **IDLE** as a valid and complete outcome.

Resource gates MAY include (non-exhaustive):
- Minimum idle time between orchestration cycles
- Maximum planning window duration
- Token and cost budgets
- Concurrency limits
- Priority decay without reinforcement
- Explicit user confirmation requirements

### SHALL NOT

- Phase 37 SHALL NOT authorize orchestration in the absence of passing gates.
- Phase 37 SHALL NOT assume infinite resources or urgency.

---

## 4. Permitted Outputs (Exhaustive)

Phase 37 outputs SHALL be limited to the following **named outcomes only**:

- **IDLE**
- **DEFER**
- **CLARIFY**
- **PLAN**
- **DELEGATE**
- **ABORT**

### SHALL

- Phase 37 SHALL emit exactly one outcome per decision cycle.
- Phase 37 SHALL treat outcomes as **authorizations or denials**, not actions.

### SHALL NOT

- Phase 37 SHALL NOT emit free-form orchestration prose.
- Phase 37 SHALL NOT encode execution logic in its outputs.
- Phase 37 SHALL NOT produce compound or chained outcomes.

---

## 5. Execution & Tooling

### SHALL

- Phase 37 SHALL remain non-executable.
- Phase 37 SHALL be side-effect free.

### SHALL NOT

Phase 37 SHALL NOT:
- execute code
- invoke tools or APIs
- schedule tasks
- perform retries
- initiate background loops
- spawn processes
- interact with the OS, network, or filesystem

---

## 6. Models, LLMs, and Capabilities

### SHALL

- Phase 37 SHALL treat all models, tools, and agents as **capabilities**, not authorities.
- Phase 37 SHALL route or escalate based on declared capability characteristics only.

### SHALL NOT

Phase 37 SHALL NOT:
- evaluate correctness
- judge truth or quality
- verify outputs
- cross-check facts
- perform reasoning about content

Any evaluation of correctness occurs **outside Phase 37**.

---

## 7. Memory, Identity, and State

### SHALL

- Phase 37 SHALL operate on ephemeral state only.
- Phase 37 SHALL assume all state is reconstructible.

### SHALL NOT

Phase 37 SHALL NOT:
- write to memory
- mutate identity
- persist beliefs, preferences, or conclusions
- accumulate long-lived internal state

---

## 8. Intelligence & Reasoning

### SHALL

- Phase 37 SHALL remain **non-intelligent by design**.

### SHALL NOT

Phase 37 SHALL NOT:
- reason
- analyze
- infer
- optimize
- simulate outcomes
- generate insights
- perform "light" or "preliminary" thinking

**There is no acceptable level of reasoning in Phase 37.**

---

## 9. Anti-Goals (Explicit)

Phase 37 SHALL NOT attempt to:
- be helpful through intelligence
- anticipate downstream reasoning
- smooth execution paths
- reduce cognitive load by thinking
- "just plan a little"

**Phase 37 exists to decide whether intelligence should be invoked at all.**

---

## 10. Failure Handling

### SHALL

Phase 37 SHALL surface:
- uncertainty
- missing information
- constraint violations
- conflicts

Phase 37 SHALL prefer **pause**, **defer**, or **clarify** over speculation.

### SHALL NOT

- Phase 37 SHALL NOT fail silently.
- Phase 37 SHALL NOT fabricate confidence.

---

## 11. Auditability

### SHALL

Phase 37 SHALL be fully auditable via:
- inputs
- gates evaluated
- outcome selected

Phase 37 decisions SHALL be explainable **without replaying execution**.

### SHALL NOT

- Phase 37 SHALL NOT depend on hidden heuristics or undocumented logic.

---

## 12. Violation Policy

Any of the following constitutes a **hard violation**:

- Adding code to Phase 37
- Introducing reasoning or heuristics
- Allowing orchestration without gates
- Enabling execution or tool calls
- Writing or mutating memory
- Expanding outputs beyond the defined set

**Hard violations require rollback and review before progress continues.**

---

## Closing Constraint

Phase 37 is not a limitation.  
It is the **discipline layer** that makes all future capability safe.

**If Phase 37 is weakened, the system is unsafe—regardless of downstream power.**

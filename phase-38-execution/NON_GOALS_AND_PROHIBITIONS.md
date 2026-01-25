# Phase 38 — Execution
## NON-GOALS & PROHIBITIONS (Design-Only)

**Status:** DESIGN-ONLY  
**Authority:** Constitutional Boundary  
**Purpose:** Prevent backward bleed, autonomy creep, and erosion of orchestration discipline before any implementation exists.

---

## 1. Scope Clarification

Phase 38 is the **only phase where execution may occur**.

Execution means:
- tool invocation
- API calls
- OS / filesystem / network interaction
- external side effects
- action with irreversible consequences

Phase 38 exists **downstream** of Phases 35–37 and is subordinate to them.

---

## 2. Explicit Non-Goals (What Phase 38 Is Not)

Phase 38 is **not**:
- an intelligence layer
- a planner or strategist
- a decision authority
- a reasoning engine
- a memory system
- an identity manager
- a self-directing agent
- an autonomy layer

**Execution is a mechanical function, not a cognitive one.**

---

## 3. Authority Constraints

### SHALL

- Phase 38 SHALL execute **only when explicitly authorized** by Phase 37.
- Phase 38 SHALL execute **only the outcome authorized**.
- Phase 38 SHALL treat authorization as **narrow and literal**.

### SHALL NOT

- Phase 38 SHALL NOT reinterpret intent.
- Phase 38 SHALL NOT expand scope.
- Phase 38 SHALL NOT chain actions beyond authorization.
- Phase 38 SHALL NOT self-initiate execution.

**Any deviation is a hard violation.**

---

## 4. No Backward Influence (Critical)

Phase 38 SHALL NOT:
- influence Phase 37 decisions
- bypass Phase 37 gates
- modify orchestration outcomes
- request "exceptions" or "just one more step"
- escalate urgency to force authorization

**Phase 38 has no voice upstream.**

---

## 5. No Intelligence Substitution

Phase 38 SHALL NOT:
- reason about what should be done
- evaluate correctness or quality
- choose between alternatives
- optimize execution paths
- infer missing steps
- "fill in gaps" left by orchestration

**If something is ambiguous, Phase 38 must fail closed and return control.**

---

## 6. No Memory or Identity Authority

Phase 38 SHALL NOT:
- write to memory
- modify identity
- update beliefs, preferences, or conclusions
- persist long-lived state

**Execution does not learn.**  
**Execution does not remember.**

---

## 7. No Silent Expansion of Power

Phase 38 SHALL NOT:
- add new tools without explicit authorization
- combine tools unless explicitly permitted
- perform retries beyond authorized limits
- schedule future actions autonomously
- create background processes

**There are no implied permissions.**

---

## 8. Error Handling (Fail Closed)

### SHALL

- Phase 38 SHALL surface errors immediately.
- Phase 38 SHALL halt on ambiguity.
- Phase 38 SHALL return control to orchestration on failure.

### SHALL NOT

- Phase 38 SHALL NOT guess.
- Phase 38 SHALL NOT retry creatively.
- Phase 38 SHALL NOT mask failure as success.

---

## 9. No Autonomy by Aggregation

Phase 38 SHALL NOT:
- accumulate small permissions into larger authority
- infer patterns across executions
- learn execution preferences
- develop habits or routines

**Repeated authorization does not equal autonomy.**

---

## 10. Resource Discipline

### SHALL

Phase 38 SHALL:
- respect resource limits passed from Phase 37
- terminate when limits are reached

### SHALL NOT

Phase 38 SHALL NOT:
- exceed budgets
- borrow from future allocations
- trade safety for completion

---

## 11. Human Override

### SHALL

Phase 38 SHALL:
- yield immediately to human intervention
- expose execution state transparently

### SHALL NOT

Phase 38 SHALL NOT:
- resist interruption
- complete "just one more step"

---

## 12. Prohibited Design Smells (Red Flags)

The following are design smells indicating backward bleed and must be **rejected**:

- "Execution helper intelligence"
- "Light reasoning for safety"
- "Just-in-case retries"
- "Auto-completion of tasks"
- "Implicit execution chains"
- "Temporary autonomy"
- "Silent defaults"

**If it sounds helpful, it is probably illegal here.**

---

## 13. Relationship to Phase 37 (Hard Boundary)

**Phase 37 decides**  
**Phase 38 acts**

**Phase 38 never decides whether to act**

Phase 37 may deny execution.  
Phase 38 may not override denial.

---

## 14. Implementation Freeze Condition

No Phase 38 code may be written until:
- Phase 37 is frozen
- Phase 37 passes audit
- Phase 38 non-goals are acknowledged
- Backward bleed risk is reviewed

**Violation requires rollback.**

---

## Closing Constraint

Phase 38 is powerful **only because it is constrained**.

If Phase 38 gains intelligence, Phase 37 becomes meaningless.  
If Phase 37 is bypassed, the system is unsafe.

**This document exists to ensure neither can happen quietly.**

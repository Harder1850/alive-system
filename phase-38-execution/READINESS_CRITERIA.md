# Phase 38 — Execution
## READINESS CRITERIA (Design-Only)

**Status:** BLOCKING  
**Authority:** Constitutional Gate  
**Purpose:** Define the exact conditions that must be satisfied before any Phase 38 execution code may be written, reviewed, or merged.

**Failure to meet any criterion blocks implementation.**

---

## 1. Phase 37 Closure Verification (Mandatory)

Phase 38 may not proceed unless all of the following are true:

- ☐ Phase 37 README.md is finalized and frozen
- ☐ Phase 37 GUARDRAILS.md exists and is enforced
- ☐ Phase 37 AUDIT_CHECKLIST.md exists and passes
- ☐ No open design questions remain in Phase 37
- ☐ Phase 37 has no TODOs, placeholders, or "future work" markers

**Any open ambiguity blocks Phase 38.**

---

## 2. Phase 37 Audit Pass (Hard Requirement)

- ☐ Phase 37 passes the full AUDIT_CHECKLIST with no FAIL items
- ☐ Audit is conducted by a reviewer not authoring Phase 38
- ☐ Audit results are recorded and preserved

**Phase 38 cannot proceed on self-certification.**

---

## 3. Phase 38 Non-Goals Acknowledgment

- ☐ NON_GOALS_AND_PROHIBITIONS.md exists
- ☐ All contributors acknowledge Phase 38 non-goals
- ☐ No implementation plan conflicts with documented prohibitions

**Any conflict requires revision before proceeding.**

---

## 4. Explicit Authorization Interface Definition

Before any code exists, the following must be defined in documentation:

- ☐ Exact interface by which Phase 37 authorizes Phase 38
- ☐ Allowed authorization outcomes (must match Phase 37 outputs)
- ☐ Required fields for authorization (scope, limits, duration)
- ☐ Explicit denial and abort semantics

**No implicit permissions are allowed.**

---

## 5. Fail-Closed Execution Semantics

- ☐ Execution failure behavior is documented
- ☐ Ambiguity handling is defined (must halt and return control)
- ☐ No retry behavior exists without explicit authorization
- ☐ Error propagation path back to Phase 37 is documented

**Execution must fail closed, not improvise.**

---

## 6. Resource Limit Enforcement Plan

- ☐ Resource limits are passed explicitly from Phase 37
- ☐ Execution must halt when limits are reached
- ☐ No borrowing, smoothing, or auto-extension of limits
- ☐ Budget enforcement is testable

**Resource discipline must be enforceable, not aspirational.**

---

## 7. Tool & Capability Inventory (Static)

- ☐ List of allowed tools exists (design-only)
- ☐ Each tool has a declared scope and boundary
- ☐ No dynamic discovery or expansion of tools
- ☐ Tool composition rules are explicit

**Unknown tools are prohibited.**

---

## 8. No Intelligence Substitution Guarantee

- ☐ Phase 38 contains no reasoning, planning, or optimization
- ☐ No heuristics, inference, or "helper logic"
- ☐ No correctness, quality, or safety evaluation logic
- ☐ All intelligence remains upstream

**If execution "thinks," readiness has failed.**

---

## 9. No Memory or Identity Mutation Plan

- ☐ Phase 38 has no write access to memory
- ☐ Identity is immutable from Phase 38
- ☐ Any state is ephemeral and discardable
- ☐ No learning, habit formation, or preference accumulation

**Execution does not learn.**

---

## 10. Human Override & Kill Semantics

- ☐ Human interrupt mechanism is defined
- ☐ Execution halts immediately on override
- ☐ State exposure on interrupt is documented
- ☐ No resistance or completion attempts

**Humans outrank execution.**

---

## 11. Observability Without Authority

- ☐ Execution observability is defined (logs, signals)
- ☐ Observability does not grant control or escalation
- ☐ No adaptive behavior based on observation

**Seeing is not deciding.**

---

## 12. Phase Boundary Enforcement Review

- ☐ Explicit review of all Phase 37 ↔ Phase 38 boundaries
- ☐ No backward calls or influence paths
- ☐ No shared mutable state
- ☐ No shortcut interfaces

**Boundaries must be structural, not cultural.**

---

## 13. Implementation Freeze Confirmation

- ☐ No Phase 38 code exists yet
- ☐ No scaffolding, helpers, or "temporary" execution logic
- ☐ No PRs pending with execution content

**Readiness must precede code, not follow it.**

---

## 14. Final Authorization

Phase 38 implementation may begin only if:

- ☐ All criteria above are satisfied
- ☐ Reviewers explicitly approve readiness
- ☐ Approval is recorded and preserved

**Missing approval = blocked.**

---

## FINAL GATE

- ☐ **READY** — Phase 38 may be implemented
- ☐ **NOT READY** — Phase 38 remains blocked

**Default state is NOT READY.**

---

## Closing Constraint

Execution is the most dangerous capability in the system.

If Phase 38 begins without meeting these criteria,  
the system is unsafe by construction.

**This document exists to make that impossible to ignore.**

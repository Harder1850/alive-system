# Phase Boundary Contract
## Phase 37 ↔ Phase 38 Authorization Interface

**Status:** CANONICAL  
**Authority:** Constitutional Boundary  
**Scope:** Declarative Interface Only  
**Purpose:** Define the only lawful handoff between Orchestration (Phase 37) and Execution (Phase 38).

This contract exists to prevent backward bleed, scope expansion, and implicit authority.

---

## 1. Boundary Principle

**Phase 37 authorizes.**  
**Phase 38 executes.**

No other relationship is permitted.

Phase 38 has no independent authority, judgment, or discretion.

---

## 2. Directionality (Hard Constraint)

Information flow is **one-way: Phase 37 → Phase 38**

- Phase 38 SHALL NOT influence, modify, or negotiate Phase 37 decisions
- Phase 38 SHALL NOT request expanded authorization

**There is no feedback loop at this boundary.**

---

## 3. Authorization Artifact (Conceptual)

Phase 37 may emit a single **Authorization Artifact**.

This artifact is:
- declarative
- immutable
- scope-limited
- time-bounded
- revocable

**It represents permission, not instruction.**

---

## 4. Required Authorization Fields (Exhaustive)

Any authorization passed from Phase 37 to Phase 38 MUST include:

### Outcome Type
One of the permitted Phase 37 outcomes:
- **PLAN**
- **DELEGATE**

(All other outcomes terminate before Phase 38)

### Authorized Scope
- Explicit description of what may be executed
- No implicit expansion

### Permitted Capabilities
- Enumerated list of allowed tools or executors
- No dynamic discovery

### Resource Limits
- Time bounds
- Cost / token limits
- Concurrency limits

### Termination Conditions
- Explicit stop conditions
- Failure thresholds

### Revocation Semantics
- Conditions under which authorization is withdrawn
- Immediate halt required on revocation

**Absence of any required field renders the authorization invalid.**

---

## 5. Forbidden Authorization Content

Authorization MUST NOT include:
- reasoning or justification
- decision logic
- conditional branching
- fallback plans
- retries or optimization strategies
- implicit permissions
- future intent

**Authorization is literal and narrow.**

---

## 6. Phase 38 Obligations Upon Receipt

Upon receiving authorization, Phase 38 SHALL:
- validate completeness of authorization
- validate scope and limits
- execute only what is explicitly authorized
- halt immediately on ambiguity or limit breach

Phase 38 SHALL NOT:
- infer missing details
- extend scope
- reinterpret intent
- chain actions
- continue after authorization expiry

---

## 7. Denial & Abort Semantics

If Phase 37 emits:
- **IDLE**
- **DEFER**
- **CLARIFY**
- **ABORT**

Phase 38 must **not activate**.

**There is no "partial execution" pathway.**

---

## 8. Failure & Return Channel

Phase 38 may return **signals only**, such as:
- success
- failure
- limit reached
- interruption

Returned signals:
- are descriptive, not interpretive
- carry no authority
- do not trigger execution by themselves

**All further action requires new Phase 37 authorization.**

---

## 9. No Implicit Continuation

Completion of an authorized execution:
- does not grant permission for follow-on actions
- does not imply future authorization
- does not accumulate authority

**Each execution cycle is isolated.**

---

## 10. Human Authority Supremacy

Human override:
- supersedes all authorization
- immediately halts Phase 38
- does not require Phase 37 approval

**Phase 38 SHALL yield without resistance.**

---

## 11. Audit Requirements

For every authorization handoff, the following must be auditable:
- authorization artifact contents
- resource limits applied
- execution start and stop
- termination reason

**Lack of auditability constitutes a violation.**

---

## 12. Violation Conditions

Any of the following is a **hard violation**:
- execution without authorization
- execution beyond authorized scope
- execution after revocation
- inferred or expanded permissions
- backward influence into Phase 37

**Violations require rollback and review.**

---

## Closing Statement

This contract defines the **only lawful interface** between Orchestration and Execution.

If this boundary is weakened:
- Phase 37 becomes meaningless
- Phase 38 becomes unsafe
- the system loses constitutional integrity

**This document exists so that cannot happen quietly.**

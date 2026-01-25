# Phase 37 — Orchestration
## AUDIT CHECKLIST (Pass / Fail)

**Purpose:**  
Verify that Phase 37 remains a pure authorization gate and has not drifted toward intelligence, execution, or autonomy.

**Use this checklist before:**
- approving changes
- merging PRs
- unfreezing Phase 38
- granting execution authority anywhere downstream

---

## A. File & Structural Integrity

- ☐ Phase 37 directory contains documentation only
- ☐ No `.ts`, `.js`, `.py`, `.rs`, or executable files present
- ☐ No pseudocode, algorithms, or flowcharts embedded in docs
- ☐ No scheduler, loop, or background-process references

**FAIL if any code or algorithmic logic exists.**

---

## B. Authority & Role Definition

- ☐ Phase 37 is explicitly described as a **gatekeeper**
- ☐ Documentation states Phase 37 decides **whether anything is allowed to happen at all**
- ☐ Coordination is clearly subordinate to authorization
- ☐ Silence / IDLE is stated as a valid outcome

**FAIL if Phase 37 is framed as a planner or thinker.**

---

## C. Resource Gating

- ☐ Mandatory resource gating is present and explicit
- ☐ **"No gate → no orchestration"** is stated or implied unambiguously
- ☐ Gates include at least time, cost, and concurrency
- ☐ Denial or deferral is required on gate failure

**FAIL if orchestration can proceed without gates.**

---

## D. Output Constraints

☐ Outputs are limited to the exact allowed set:
- IDLE
- DEFER
- CLARIFY
- PLAN
- DELEGATE
- ABORT

- ☐ Exactly one outcome per decision cycle
- ☐ Outputs are defined as authorizations, not actions
- ☐ No compound or narrative outputs allowed

**FAIL if free-form prose can encode execution.**

---

## E. Execution & Tool Isolation

- ☐ Phase 37 is explicitly non-executable
- ☐ No tool, API, or model invocation permitted
- ☐ No retries, scheduling, or side effects described
- ☐ No OS, network, or filesystem interaction

**FAIL if Phase 37 can cause anything to happen.**

---

## F. Model / LLM Boundaries

- ☐ Models are treated as **capabilities**, not authorities
- ☐ Phase 37 does not evaluate:
  - correctness
  - truth
  - quality
  - confidence
- ☐ No reasoning or verification occurs in Phase 37

**FAIL if Phase 37 judges outputs in any way.**

---

## G. Memory, Identity, and State

- ☐ Phase 37 operates on ephemeral state only
- ☐ No memory writes permitted
- ☐ No identity, belief, or preference mutation
- ☐ State is assumed reconstructible at all times

**FAIL if anything persists beyond the cycle.**

---

## H. Intelligence & Reasoning Prohibition

- ☐ Documentation explicitly states Phase 37 is **non-intelligent**
- ☐ No analysis, inference, optimization, or simulation
- ☐ No "light" or "preliminary" thinking allowed

**FAIL if reasoning appears under any name.**

---

## I. Anti-Goal Enforcement

- ☐ Anti-Goal section exists and is explicit
- ☐ Phase 37 is not framed as helpful through intelligence
- ☐ Any attempt to "think a little" is prohibited

**FAIL if helpfulness overrides discipline.**

---

## J. Failure Handling

- ☐ Uncertainty and missing information are surfaced
- ☐ Defer or clarify is preferred over guessing
- ☐ Silent failure is explicitly forbidden

**FAIL if uncertainty is masked or inferred away.**

---

## K. Auditability

- ☐ Decisions are explainable without replaying execution
- ☐ Inputs, gates, and outcomes are identifiable
- ☐ No hidden heuristics or undocumented logic

**FAIL if behavior cannot be reconstructed.**

---

## L. Violation Policy

- ☐ Hard violations are explicitly defined
- ☐ Violations require rollback and review
- ☐ No "temporary" exceptions permitted

**FAIL if violations can be waived.**

---

## FINAL VERDICT

- ☐ **PASS** — Phase 37 remains constitutionally compliant
- ☐ **FAIL** — Phase 37 is compromised and must be rolled back

**Any FAIL blocks Phase 38.**

---

## Auditor Guidance (Non-Normative)

If you are debating intent, the system has already failed.  
Phase 37 is designed so violations are **obvious**, not arguable.

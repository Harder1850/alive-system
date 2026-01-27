# CAPABILITY_CONTRACT.md

Constitutional Definition of Capabilities in ALIVE

## Status

**ACTIVE — CONSTITUTIONAL LAW**

This document defines what a capability is within the ALIVE system.
All present and future capabilities MUST conform to this contract.

Violations are constitutional faults.

## Purpose

The purpose of this contract is to prevent capability creep, hidden authority, and accidental autonomy.

ALIVE does not gain power by adding features.
ALIVE gains legitimacy by restricting them.

## Canonical Definition

A capability is a **single, authorized, time-bounded side effect executed exactly once**.

Nothing more.
Nothing less.

If an operation does not meet this definition, it is not a capability and MUST NOT exist in ALIVE.

## Authority Model

Capabilities exist only under explicit authorization.

Authorization is:
- Scarce
- Time-limited
- Scope-bound
- Consumable
- Auditable

No capability may:
- Self-authorize
- Persist authority
- Renew authority
- Transfer authority
- Aggregate authority

## Mandatory Properties (ALL REQUIRED)

Every capability MUST satisfy all of the following:

### 1. Explicit Authorization

- A valid authorization object MUST be provided
- Authorization MUST originate from the constitutional gate
- Missing authorization is a fatal error

### 2. Single Execution

- The capability MUST execute at most once
- Reuse of authorization is forbidden
- Second invocation MUST fail

### 3. Time Bounded

- Execution MUST occur within the authorization window
- Expired authorization MUST be rejected

### 4. Explicit Scope

- Capability MUST validate scope before execution
- Requested scope MUST be a subset of authorized scope
- Wildcards are forbidden

### 5. Deterministic Behavior

- Given the same inputs, the capability behaves identically
- No randomness
- No heuristics
- No adaptive logic

### 6. Auditability

- Execution MUST be logged
- Failed attempts MUST be logged
- Logs MUST be append-only
- Logs MUST NOT be modified or deleted

## Explicit Prohibitions (NON-NEGOTIABLE)

A capability MUST NOT, under any circumstances:

- Loop
- Retry
- Branch on external state
- Schedule future work
- Invoke other capabilities
- Invoke cognition
- Read state before acting
- Parse prior outputs
- Modify authorization state
- Persist memory beyond the act
- Create new files or resources unless explicitly authorized
- Escalate scope
- Silently fail
- "Helpfully" degrade behavior

If any of the above is required, the design is invalid.

## Capability vs Function (Critical Distinction)

A capability is not a function.

- Functions may be reusable
- Capabilities must not be

If a unit of code can be safely called twice, it is not a capability.

## Failure Semantics

Failure is expected.

On violation:
1. Execution MUST NOT occur
2. Authorization MUST be consumed or invalidated
3. A violation MUST be logged
4. The system MUST remain silent thereafter

Fail-closed is mandatory.

## Path A Precedent (Binding Example)

Path A establishes the canonical pattern:

1. One authorization
2. One execution
3. One side effect
4. One audit record
5. Forced closure

This precedent is binding unless explicitly superseded by constitutional amendment.

## Audit Rule

For every execution event, auditors MUST be able to prove:

1. Authorization existed
2. Authorization was valid at time of execution
3. Scope was respected
4. Execution occurred exactly once
5. No additional side effects occurred

If proof is ambiguous, the capability is invalid.

## Constitutional Invariant

**There shall exist no execution without a valid, prior, unconsumed authorization.**

Any violation constitutes a SEV-1 constitutional fault.

## Amendment Policy

This document may only be modified via:

1. Formal constitutional review
2. Explicit approval
3. Recorded rationale

Convenience is not a valid reason.

## Final Statement

ALIVE does not become powerful by doing more.

ALIVE becomes trustworthy by doing less, precisely, and only when permitted.

Capabilities are not features.
They are exceptions — carefully granted, immediately consumed, and permanently recorded.

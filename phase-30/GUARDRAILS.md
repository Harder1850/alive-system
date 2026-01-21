# Phase 30 guardrails

## Invariants

- No execution.
- No actions.
- No recommendations.
- No conclusions.
- No memory mutation.
- No learning.
- No behavioral influence.
- No listeners, hooks, or callbacks.
- No automatic or continuous operation.
- Pull-based only.
- No dependence on live streams.
- No persistence of internal state.
- No external services.
- No spine imports or edits.

## Allowed

- Read event arrays in memory.
- Aggregate counts.
- Detect co-occurrence, temporal ordering, and repeated structural shapes.
- Emit descriptive pattern reports that match the Phase 30 schema.


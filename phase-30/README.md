# Phase 30 — Pattern Detection, Zero Execution

Phase 30 adds a read-only observer that summarizes accumulated experience events into a deterministic pattern report.

## Prohibitions

- No execution authority.
- No actions.
- No conclusions.
- No memory mutation.
- No learning.
- No listeners, hooks, or callbacks.
- No automatic or continuous operation.
- No dependence on live streams.
- No persistence of internal state.
- No external services.
- No imports or edits of spine code.

## Manual invocation

This phase exports a single interface:

```ts
export interface PatternObserver {
  read(events: ReadonlyArray<Event>): PatternReport;
}
```

Input is an in-memory array of events. Output is a plain object.

Writing the report to `.alive-data/patterns.readonly.json` is handled outside Phase 30 by an explicit caller.

Deletion of the `phase-30/` folder changes no runtime behavior.


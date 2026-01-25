# Phase 35 — Intent Router

## Purpose
Translate natural language input into structured intent.

Intent routing is the **bridge between language and action**.

## Inputs
- Typed text
- (Later) voice transcription

## Outputs
Structured intent objects, e.g.:
- query
- remember
- plan
- summarize
- reference
- delegate

## Responsibilities
- Detect intent
- Ask clarification when ambiguous
- Never execute actions
- Never mutate memory directly

## Explicit Non-Responsibilities
- No execution
- No planning
- No background loops

## Design Principle
If intent is unclear:
> Ask before acting.

Silence is a failure.

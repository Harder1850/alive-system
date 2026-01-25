# ALIVE System

## Purpose
`alive-system` is the **cognitive and orchestration layer** of ALIVE.

It is responsible for:
- Understanding intent
- Managing memory
- Planning and strategy
- Background thinking (Genesis)
- Coordinating tools and LLMs

This repo **does not execute actions**.

## Design Philosophy
ALIVE is a **local-first orchestrator**.

It does not try to:
- Know everything
- Store everything
- Run a GUI constantly
- Replace LLMs

Instead, it:
- Filters
- Compresses
- Coordinates
- Delegates

## Key Concepts
- Memory is finite
- Forgetting is allowed
- Archives are references, not cognition
- LLMs are tools, not brains
- Most work happens off the UI thread

## Implemented Phases
- Phase 30 — Pattern Observer (read-only)
- Phase 33 — Charter & Audit (docs only)
- Phase 34 — File-backed working memory
- Phase 35 — Intent routing (in progress)

## Planned Phases
- Phase 36 — Project context memory
- Phase 37 — Genesis background thinking
- Phase 38 — Voice input

## Execution Boundary
`alive-system` **cannot**:
- Execute system commands
- Modify the OS
- Act without explicit authorization

All execution is delegated to **alive-body**.

## Canonical Audit Reference
See:
- `alive-core/CONSTITUTIONAL_AUDITS.md`

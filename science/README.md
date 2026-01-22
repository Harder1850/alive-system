# Science & Technology Intuition Stack

This folder is ALIVE’s **Science & Technology Intuition Stack**.

## Purpose

Provide a compact, operational backbone for:

- causal intuition (not encyclopedic knowledge)
- fast decision support under time pressure
- explicit awareness of limits, tradeoffs, and risk
- offline-first operation
- clean separation between intuition vs reference

This layer must never claim authority beyond its scope.

## Guardrails

- **Read-only** at runtime
- **Never mutates** at runtime
- **Offline-first** (no internet required)
- **Human-readable** Markdown only
- **Not a reference index** (no authorities here)
- **Not a knowledge base** (no trivia)

Internally refer to this as:

- **Science & Technology Intuition Stack**

Never call it:

- “science knowledge base”
- “physics engine”
- “expert system”

## Content rules

This layer stores ONLY:

- laws
- invariants
- intuition
- causal direction
- tradeoffs
- failure modes
- “what matters vs what doesn’t”

This layer must NOT store:

- constants
- species lists
- protocols
- specs
- dosages
- step-by-step procedures
- academic derivations

If precision or liability matters → `lookup_required`.

## How ALIVE uses this layer

- Consulted during intent reasoning
- Shapes: confidence, urgency, output length, risk framing
- Never quoted verbatim as “facts”
- Never used to override user authority

Example UI behavior:

```
[intent] urgent
[science] high energy cost, low reversibility
Recommendation: stabilize first, reassess in 30 minutes.
```

## Storage model (guidance, not enforcement)

- Core intuition text: ~120–200 MB
- Embeddings (optional, later): ~150–200 MB
- Reference index: ~5–15 MB

ALIVE must remain functional without embeddings.

## Design doctrine

“ALIVE understands constraints, not trivia.
It reasons about reality, not authority.
It acts fast when needed and defers precisely when required.”


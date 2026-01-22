# Decision Heuristics

These rules are **routing constraints**, not advice.

## Required rules (verbatim)

Urgency first

High urgency → 1 source only

Low urgency → correctness > speed

Authority hierarchy

Definitions > calculators

Primary sources > aggregators

Anti-pattern

Never consult more than one source per lookup pass unless results conflict.

Conversion invariant

Never invent conversions. Always verify.

Emergency heuristic

“What stabilizes the situation fastest without creating a new catastrophe?”

## Authority ranking (operational)

1. Primary standards/regulators (e.g., NIST, BIPM, SEC)
2. Authoritative institutions (e.g., MIT OpenCourseWare, CFA Institute)
3. Fast references (only when low stakes)
4. Calculators (only for arithmetic after definitions are confirmed)

## When to trigger `lookup_required`

- High stakes + low confidence
- Any unit conversion not already known with high confidence
- Any “cite/reference/authority” request where a primary source is required
- Any safety/medical/legal high-pressure context


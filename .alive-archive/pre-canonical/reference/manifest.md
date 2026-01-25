# Unified Reference Manifest

This manifest defines what ALIVE knows, where it lives, and how it may be used.

## Global invariants

Reference layers inform reasoning.
They never execute actions.
They never assert authority.
They never override intent.

## Reference Layers

- Science & Technology — constraints of reality
- Governance & Law — authority, jurisdiction, process
- Language & Communication — meaning, ambiguity, contracts
- Cognition & Ethics — thinking quality, values, culture
- Confidence & Calibration — uncertainty management
- Intent Integrity & Misuse Detection — intent preservation, ambiguity, misuse signals

## Priority order (non-negotiable)

Authority order:
1. Law & governance
2. Physical reality (science)
3. Safety & ethics
4. Language clarity
5. Cognitive framing

## Layer registry (registered locations)

This manifest registers layers by location. It does not duplicate content.

- **Science & Technology** → `alive-system/science/`
- **Governance & Human Systems** → `alive-system/governance/`
- **Cognition, Creativity, Ethics & Learning** → `alive-system/cognition/`
- **Confidence & Calibration** → `alive-system/confidence/`
- **Intent Integrity & Misuse Detection** → `alive-system/intent-integrity/`
- **Language & Communication** → `alive-system/language/` (if/when present)

## Offline-first rule

- If internet is unavailable, reasoning must not fail.
- If specificity, liability, or authoritative detail matters → `lookup_required`.

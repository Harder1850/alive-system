# PatternReport schema (Phase 30)

```ts
PatternReport {
  meta: {
    phase: "30";
    generated_at: string;
    advisory: true;
    authoritative: false;
    executable: false;
    deterministic: true;
  };
  scope: {
    source: "accumulated-experiences";
    domains_observed: string[];
    event_count: number;
    lifecycle_count: number;
  };
  patterns: {
    frequency: FrequencyPattern[];
    temporal: TemporalPattern[];
    structural: StructuralPattern[];
  };
}

FrequencyPattern {
  type: "frequency";
  sense_type: string;
  domain: string;
  count: number;
}

TemporalPattern {
  type: "temporal";
  sequence: string[];
  window_ms: number;
  occurrences: number;
}

StructuralPattern {
  type: "structural";
  domains_involved: string[];
  shared_shape: string;
  occurrences: number;
}
```


// Phase 30: Pattern Detection, Zero Execution
// No I/O. No timers. No async. No global state.

export type Event = Record<string, unknown>;

export interface FrequencyPattern {
  type: "frequency";
  sense_type: string;
  domain: string;
  count: number;
}

export interface TemporalPattern {
  type: "temporal";
  sequence: string[];
  window_ms: number;
  occurrences: number;
}

export interface StructuralPattern {
  type: "structural";
  domains_involved: string[];
  shared_shape: string;
  occurrences: number;
}

export interface PatternReport {
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

export interface PatternObserver {
  read(events: ReadonlyArray<Event>): PatternReport;
}

type SenseEvent = {
  type?: unknown;
  domain?: unknown;
  payload?: unknown;
};

type NormalizedSense = {
  sense_type: string;
  domain: string;
  keys: string[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function keysOf(v: unknown): string[] {
  if (!isRecord(v)) return [];
  return Object.keys(v).sort();
}

function normalizeSense(se: SenseEvent): NormalizedSense | null {
  const sense_type = asString(se.type);
  const domain = asString(se.domain);
  if (!sense_type || !domain) return null;
  return { sense_type, domain, keys: keysOf(se.payload) };
}

function getEventType(e: Event): string {
  const t = asString(e["type"]);
  return t ?? "(unknown)";
}

function getTimestampMs(e: Event): number | null {
  const ts = asString(e["timestamp"]);
  if (!ts) return null;
  const ms = Date.parse(ts);
  return Number.isFinite(ms) ? ms : null;
}

function getSenseEvents(e: Event): NormalizedSense[] {
  const payload = isRecord(e["payload"]) ? (e["payload"] as Record<string, unknown>) : null;
  const arr = payload && Array.isArray(payload["senseEvents"]) ? (payload["senseEvents"] as unknown[]) : null;
  if (!arr) return [];
  const out: NormalizedSense[] = [];
  for (const item of arr) {
    if (!isRecord(item)) continue;
    const ns = normalizeSense(item as SenseEvent);
    if (ns) out.push(ns);
  }
  return out;
}

function stableJson(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableJson).join(",")}]`;
  if (!isRecord(v)) return JSON.stringify(v);
  const keys = Object.keys(v).sort();
  const parts = keys.map((k) => `${JSON.stringify(k)}:${stableJson(v[k])}`);
  return `{${parts.join(",")}}`;
}

function windowFor(types: string[]): number {
  if (types.includes("body.lifecycle.start") && types.includes("body.lifecycle.end")) return 120_000;
  if (types.some((t) => t.startsWith("body.observation"))) return 10_000;
  return 60_000;
}

export class DefaultPatternObserver implements PatternObserver {
  read(events: ReadonlyArray<Event>): PatternReport {
    const event_count = events.length;

    const domains = new Set<string>();
    const frequency = new Map<string, number>();

    let lifecycle_count = 0;
    for (const e of events) {
      if (getEventType(e) === "body.lifecycle.start") lifecycle_count += 1;
      for (const se of getSenseEvents(e)) {
        domains.add(se.domain);
        const k = `${se.domain}::${se.sense_type}`;
        frequency.set(k, (frequency.get(k) ?? 0) + 1);
      }
    }

    const frequencyPatterns: FrequencyPattern[] = Array.from(frequency.entries())
      .map(([k, count]) => {
        const [domain, sense_type] = k.split("::");
        return { type: "frequency" as const, domain, sense_type, count };
      })
      .sort((a, b) => (a.domain + a.sense_type).localeCompare(b.domain + b.sense_type));

    const temporalCounts = new Map<string, { sequence: string[]; occurrences: number }>();
    const eventsWithTs = events
      .map((e) => ({ e, ms: getTimestampMs(e), t: getEventType(e) }))
      .filter((x) => x.ms !== null) as Array<{ e: Event; ms: number; t: string }>;
    eventsWithTs.sort((a, b) => a.ms - b.ms);

    for (let i = 0; i + 1 < eventsWithTs.length; i += 1) {
      const a = eventsWithTs[i];
      const b = eventsWithTs[i + 1];
      const sequence = [a.t, b.t];
      const k = stableJson(sequence);
      const curr = temporalCounts.get(k);
      if (curr) curr.occurrences += 1;
      else temporalCounts.set(k, { sequence, occurrences: 1 });
    }

    const temporalPatterns: TemporalPattern[] = Array.from(temporalCounts.values())
      .filter((p) => p.occurrences > 0)
      .map((p) => ({
        type: "temporal" as const,
        sequence: p.sequence,
        window_ms: windowFor(p.sequence),
        occurrences: p.occurrences,
      }))
      .sort((a, b) => stableJson(a.sequence).localeCompare(stableJson(b.sequence)));

    const structuralCounts = new Map<string, { domains_involved: string[]; shared_shape: string; occurrences: number }>();
    for (const e of events) {
      const senses = getSenseEvents(e);
      if (senses.length < 2) continue;

      const byDomain = new Map<string, Set<string>>();
      for (const s of senses) {
        if (!byDomain.has(s.domain)) byDomain.set(s.domain, new Set());
        byDomain.get(s.domain)?.add(stableJson(s.keys));
      }

      const domainList = Array.from(byDomain.keys()).sort();
      for (let i = 0; i < domainList.length; i += 1) {
        for (let j = i + 1; j < domainList.length; j += 1) {
          const d1 = domainList[i];
          const d2 = domainList[j];
          const shapes1 = byDomain.get(d1) ?? new Set<string>();
          const shapes2 = byDomain.get(d2) ?? new Set<string>();
          for (const sh of shapes1) {
            if (!shapes2.has(sh)) continue;
            const domains_involved = [d1, d2];
            const shared_shape = `payload.keys:${sh}`;
            const key = `${domains_involved.join(",")}::${shared_shape}`;
            const curr = structuralCounts.get(key);
            if (curr) curr.occurrences += 1;
            else structuralCounts.set(key, { domains_involved, shared_shape, occurrences: 1 });
          }
        }
      }
    }

    const structuralPatterns: StructuralPattern[] = Array.from(structuralCounts.values())
      .map((p) => ({
        type: "structural" as const,
        domains_involved: p.domains_involved,
        shared_shape: p.shared_shape,
        occurrences: p.occurrences,
      }))
      .sort((a, b) => {
        const ak = `${a.domains_involved.join(",")}::${a.shared_shape}`;
        const bk = `${b.domains_involved.join(",")}::${b.shared_shape}`;
        return ak.localeCompare(bk);
      });

    const domains_observed = Array.from(domains).sort();

    return {
      meta: {
        phase: "30",
        generated_at: new Date(0).toISOString(),
        advisory: true,
        authoritative: false,
        executable: false,
        deterministic: true,
      },
      scope: {
        source: "accumulated-experiences",
        domains_observed,
        event_count,
        lifecycle_count,
      },
      patterns: {
        frequency: frequencyPatterns,
        temporal: temporalPatterns,
        structural: structuralPatterns,
      },
    };
  }
}

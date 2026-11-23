// Shared ASR reconciliation. Does not mutate the supplied units or split hyphens.
export const stripTrailingPunctuation = (word) => String(word).replace(/[.,!?\u2026;:'"\u2019\u201d(.]+$/u, '');
export const normalizeHeard = (word) => stripTrailingPunctuation(word).toLowerCase();

/** Apply dictionary rules to timed units, preserving input shapes and raw indices. */
export function applyRules(inputUnits, rules = {}) {
  const assertCount = (rule, actual, kind) => {
    if (rule.count !== undefined && (!Number.isInteger(rule.count) || rule.count < 0 || actual !== rule.count)) {
      const source = Array.isArray(rule.from) ? rule.from.join(' ') : rule.from;
      throw new Error(`${kind} "${source}" expected ${rule.count} occurrences, found ${actual}`);
    }
  };
  const units = inputUnits.map((unit, index) => ({...unit, rawIndex: unit.rawIndex ?? index}));
  const records = [];
  // Consumption is tracked by object identity: split splices shift indices, so an
  // index-based set would misdirect consumption marks onto unrelated units.
  const consumed = new Set();
  const stem = (unit) => normalizeHeard(unit.word);
  const suffixOf = (unit) => {
    const stripped = stripTrailingPunctuation(unit.word);
    return unit.word.slice(stripped.length);
  };

  for (const rule of rules.renames ?? []) {
    const before = records.length;
    units.forEach((unit, i) => {
      if (consumed.has(unit)) return;
      if (stem(unit) !== rule.from.toLowerCase()) return;
      if (rule.contextBefore && !(units[i - 1] && rule.contextBefore.map((c) => c.toLowerCase()).includes(stem(units[i - 1])))) return;
      if (rule.contextAfter && !(units[i + 1] && rule.contextAfter.map((c) => c.toLowerCase()).includes(stem(units[i + 1])))) return;
      consumed.add(unit);
      const heard = unit.word;
      unit.word = rule.to + suffixOf(unit);
      records.push({rawIndex: unit.rawIndex, heard, scriptFaithful: unit.word, class: rule.class ?? 'phonetic-variant', action: 'renamed', note: rule.note ?? ''});
    });
    assertCount(rule, records.length - before, "Rename");
  }
  // Split one merged token into the script pair; repeat so every occurrence resolves.
  const inContext = (units, i, rule, afterCount = 0) => {
    if (rule.contextBefore && !(units[i - 1] && rule.contextBefore.map((c) => c.toLowerCase()).includes(stem(units[i - 1])))) return false;
    if (rule.contextAfter && !(units[i + 1 + afterCount] && rule.contextAfter.map((c) => c.toLowerCase()).includes(stem(units[i + 1 + afterCount])))) return false;
    return true;
  };
  for (const rule of rules.splits ?? []) {
    const before = records.length;
    let searchFrom = 0;
    for (;;) {
      const i = units.findIndex((unit, j) => j >= searchFrom && !consumed.has(unit) && stem(unit) === rule.from.toLowerCase() && inContext(units, j, rule));
      if (i < 0) break;
      const unit = units[i];
      consumed.add(unit);
      const mid = unit.start + (unit.end - unit.start) * (rule.splitRatio ?? 0.5);
      units[i] = {...unit, word: rule.to[0], end: mid};
      units.splice(i + 1, 0, {...unit, word: rule.to[1], start: mid});
      records.push({rawIndex: unit.rawIndex, heard: unit.word, scriptFaithful: rule.to.join(' '), class: rule.class ?? 'merge-split', action: 'split', note: rule.note ?? ''});
      searchFrom = i + 2;
    }
    assertCount(rule, records.length - before, "Split");
  }
  for (const rule of rules.merges ?? []) {
    const before = records.length;
    let searchFrom = 0;
    for (;;) {
      const i = units.findIndex((unit, j) =>
        j >= searchFrom && !consumed.has(unit) && units[j + 1] && !consumed.has(units[j + 1]) &&
        stem(unit) === rule.from[0].toLowerCase() && stem(units[j + 1]) === rule.from[1].toLowerCase() &&
        inContext(units, j, rule, 1));
      if (i < 0) break;
      const a = units[i];
      const b = units[i + 1];
      consumed.add(a);
      consumed.add(b);
      units[i] = {...a, word: rule.to + suffixOf(b), end: b.end};
      units.splice(i + 1, 1);
      records.push({rawIndex: a.rawIndex, heard: `${a.word} ${b.word}`, scriptFaithful: rule.to, class: rule.class ?? 'merge-split', action: 'merged', note: rule.note ?? ''});
      searchFrom = i + 1;
    }
    assertCount(rule, records.length - before, "Merge");
  }

  return {units, records};
}

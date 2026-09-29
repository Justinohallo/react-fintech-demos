// Front matter for reviews and guides (SPEC.md §6): one `key: value` per line
// between `---` fences. Deliberately not YAML, so no parser dependency.

export function parseFrontMatter(text: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

export const toNumber = (value?: string) => (value && /^\d+(\.\d+)?$/.test(value) ? Number(value) : null);

export const toList = (value: string | undefined, separator: string) =>
  (value ?? "")
    .split(separator)
    .map((v) => v.trim())
    .filter(Boolean);

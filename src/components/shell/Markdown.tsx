import type { ReactNode } from "react";

// A deliberately small Markdown renderer for reviews (no dependencies, SPEC.md §2).
// Blocks: headings, paragraphs, bullet and numbered lists, pipe tables, fenced
// code, blockquotes. Inline: `code`, **bold**, *emphasis*, [links](url).
// `##` renders as h2, so a page's own h1 stays the only level-1 heading.

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "code"; text: string }
  | { kind: "quote"; text: string };

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function blocks(source: string): Block[] {
  const lines = source.split(/\r?\n/);
  const out: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
    } else if (line.startsWith("```")) {
      const body: string[] = [];
      for (i++; i < lines.length && !lines[i].startsWith("```"); i++) body.push(lines[i]);
      i++;
      out.push({ kind: "code", text: body.join("\n") });
    } else if (/^#{1,6}\s/.test(line)) {
      const [, hashes, text] = /^(#{1,6})\s+(.*)$/.exec(line)!;
      out.push({ kind: "heading", level: hashes.length, text });
      i++;
    } else if (line.trim().startsWith("|") && lines[i + 1]?.trim().match(/^\|?[\s:-]+\|/)) {
      const head = cells(line);
      const rows: string[][] = [];
      for (i += 2; i < lines.length && lines[i].trim().startsWith("|"); i++) rows.push(cells(lines[i]));
      out.push({ kind: "table", head, rows });
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: string[] = [];
      for (; i < lines.length && /^\s*([-*]|\d+\.)\s|^\s{2,}\S/.test(lines[i]); i++) {
        if (/^\s*([-*]|\d+\.)\s/.test(lines[i])) items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s+/, ""));
        else items[items.length - 1] += ` ${lines[i].trim()}`;
      }
      out.push({ kind: "list", ordered, items });
    } else if (line.startsWith(">")) {
      const body: string[] = [];
      for (; i < lines.length && lines[i].startsWith(">"); i++) body.push(lines[i].replace(/^>\s?/, ""));
      out.push({ kind: "quote", text: body.join(" ") });
    } else {
      const body: string[] = [];
      for (; i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*([-*]|\d+\.)\s|\|)/.test(lines[i]); i++)
        body.push(lines[i].trim());
      out.push({ kind: "paragraph", text: body.join(" ") });
    }
  }
  return out;
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (/^`[^`]+`$/.test(part))
      return (
        <code key={i} className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[0.85em] text-stone-800">
          {part.slice(1, -1)}
        </code>
      );
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link)
      return (
        <a key={i} href={link[2]} className="text-teal-800 underline underline-offset-4 hover:text-teal-950">
          {link[1]}
        </a>
      );
    return part;
  });
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="space-y-4 leading-relaxed text-stone-800">
      {blocks(source).map((b, i) => {
        switch (b.kind) {
          case "heading": {
            const level = Math.min(Math.max(b.level, 2), 4);
            const className =
              level === 2 ? "mt-8 text-xl font-semibold tracking-tight" : "mt-6 font-semibold text-stone-900";
            return level === 2 ? (
              <h2 key={i} className={className}>
                {inline(b.text)}
              </h2>
            ) : level === 3 ? (
              <h3 key={i} className={className}>
                {inline(b.text)}
              </h3>
            ) : (
              <h4 key={i} className={className}>
                {inline(b.text)}
              </h4>
            );
          }
          case "paragraph":
            return <p key={i}>{inline(b.text)}</p>;
          case "list": {
            const items = b.items.map((item, j) => <li key={j}>{inline(item)}</li>);
            return b.ordered ? (
              <ol key={i} className="list-decimal space-y-1 pl-5 marker:text-stone-400">
                {items}
              </ol>
            ) : (
              <ul key={i} className="list-disc space-y-1 pl-5 marker:text-stone-400">
                {items}
              </ul>
            );
          }
          case "table":
            return (
              <div key={i} className="relative overflow-x-auto rounded-xl border border-stone-200 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-600">
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j} scope="col" className="px-3 py-2 font-medium">
                          {inline(h)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {b.rows.map((row, j) => (
                      <tr key={j} className="align-top">
                        {row.map((cell, k) => (
                          <td key={k} className="px-3 py-2">
                            {inline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <pre key={i} className="overflow-x-auto rounded-xl bg-stone-900 p-4 font-mono text-sm text-stone-100">
                <code>{b.text}</code>
              </pre>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-stone-300 pl-4 text-stone-600">
                {inline(b.text)}
              </blockquote>
            );
        }
      })}
    </div>
  );
}

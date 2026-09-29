/**
 * The page an AC suite grades. `npm run check` sets KESTREL_BASE_PATH to the
 * mock or to an attempt; running a spec directly defaults to the mock.
 */
export function basePath(challenge: string): string {
  return process.env.KESTREL_BASE_PATH ?? `/challenges/${challenge}/mock`;
}

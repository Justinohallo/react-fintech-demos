// Code review dimensions and severities, transcribed from SPEC.md §6
// (Architect-owned). Each dimension is both a rubric row and a comment category.

export const CODE_DIMENSIONS = {
  structure: "Component structure",
  data_flow: "Props and data flow",
  styling: "Tailwind and styling",
  correctness: "Correctness",
  naming: "Naming",
  idioms: "React idioms",
  markup: "Markup",
} as const;

export type CodeDimension = keyof typeof CODE_DIMENSIONS;
export const DIMENSION_KEYS = Object.keys(CODE_DIMENSIONS) as CodeDimension[];
export const isDimension = (v: string): v is CodeDimension => v in CODE_DIMENSIONS;

export const SEVERITIES = {
  must: "Breaks an AC, a check, or correctness",
  should: "A real cost, named in the comment",
  nit: "Preference",
  good: "Worth keeping",
} as const;

export type Severity = keyof typeof SEVERITIES;
export const SEVERITY_KEYS = Object.keys(SEVERITIES) as Severity[];
export const isSeverity = (v: string): v is Severity => v in SEVERITIES;

export const RUBRIC_SCALE = [
  "Missing, or wrong in a way that breaks the result",
  "Works in places, with must-fix problems",
  "Sound, with should-fix problems",
  "Idiomatic; nits at most",
] as const;

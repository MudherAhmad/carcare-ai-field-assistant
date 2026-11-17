export type RedactionKind = "email" | "phone" | "registration" | "vin";

export interface RedactionResult {
  text: string;
  counts: Record<RedactionKind, number>;
  total: number;
}

const patterns: Array<{ kind: RedactionKind; expression: RegExp; replacement: string }> = [
  {
    kind: "email",
    expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: "[REDACTED_EMAIL]",
  },
  {
    kind: "vin",
    expression: /\b[A-HJ-NPR-Z0-9]{17}\b/gi,
    replacement: "[REDACTED_VIN]",
  },
  {
    kind: "phone",
    expression: /(?<!\w)(?:\+?\d[\d\s().-]{7,}\d)(?!\w)/g,
    replacement: "[REDACTED_PHONE]",
  },
  {
    kind: "registration",
    expression: /\b(?:[A-ZÅÄÖ]{3}[ -]?[0-9]{2}[A-Z0-9]|[A-Z]{1,3}[ -]?[0-9]{1,4}[ -]?[A-Z]{0,3})\b/gi,
    replacement: "[REDACTED_REGISTRATION]",
  },
];

export function redactSensitiveText(input: string): RedactionResult {
  const counts: Record<RedactionKind, number> = {
    email: 0,
    phone: 0,
    registration: 0,
    vin: 0,
  };

  let text = input.normalize("NFKC").replace(/\u0000/g, "").trim();
  for (const pattern of patterns) {
    text = text.replace(pattern.expression, () => {
      counts[pattern.kind] += 1;
      return pattern.replacement;
    });
  }

  return {
    text,
    counts,
    total: Object.values(counts).reduce((sum, count) => sum + count, 0),
  };
}

import type { Messages } from "../i18n/messages";

const PREPAY_ERROR = /prepayment credits are depleted|prepay(?:ment)? credits?|no credits/i;

export function toUserFacingAiError(cause: unknown, messages: Messages): string {
  const rawMessage = cause instanceof Error ? cause.message : String(cause ?? "");

  if (PREPAY_ERROR.test(rawMessage)) {
    return messages.billingCreditRequired;
  }

  return messages.aiUnavailable;
}

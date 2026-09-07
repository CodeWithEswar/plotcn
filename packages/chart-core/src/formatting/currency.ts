import { isFiniteNumber } from "../data/predicates"

export interface CurrencyFormatOptions extends Intl.NumberFormatOptions {
  currency: string
  locale?: string
}

/**
 * Formats a currency value using Intl.NumberFormat.
 * Requires an explicit ISO currency code (never assumes USD or any default currency).
 *
 * Supports both options object:
 * ```ts
 * formatCurrency(42500, { currency: "INR", locale: "en-IN" })
 * ```
 * and positional arguments for backwards compatibility:
 * ```ts
 * formatCurrency(42500, "USD", "en-US")
 * ```
 */
export function formatCurrency(
  value: number,
  optionsOrCurrency: string | CurrencyFormatOptions,
  legacyLocale = "en-US"
): string {
  if (!isFiniteNumber(value)) return "—"

  let currency: string
  let locale: string
  let numberFormatOptions: Intl.NumberFormatOptions = {}

  if (typeof optionsOrCurrency === "string") {
    currency = optionsOrCurrency
    locale = legacyLocale
  } else {
    currency = optionsOrCurrency.currency
    locale = optionsOrCurrency.locale || "en-US"
    const { currency: _c, locale: _l, ...rest } = optionsOrCurrency
    numberFormatOptions = rest
  }

  if (!currency) {
    return String(value)
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      ...numberFormatOptions,
    }).format(value)
  } catch {
    return `${currency} ${value}`
  }
}

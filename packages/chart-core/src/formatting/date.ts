/**
 * Formats a Date instance, timestamp number, or ISO string using Intl.DateTimeFormat.
 */
export function formatDate(
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
  locale = "en-US"
): string {
  try {
    const d = date instanceof Date ? date : new Date(date)
    if (Number.isNaN(d.getTime())) return "—"
    return new Intl.DateTimeFormat(locale, options).format(d)
  } catch {
    return "—"
  }
}

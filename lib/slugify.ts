/**
 * Converts a heading text into a URL-friendly anchor ID.
 * Handles casing, special characters, and trims trailing hyphens.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and hyphens)
    .replace(/[\s_-]+/g, "-")  // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "")   // Trim hyphens from start and end
}

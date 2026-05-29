export function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isIndexableContent(
  value: unknown,
  requiredFields: string[] = ["slug", "title", "description"]
): boolean {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return requiredFields.every(
    (field) =>
      typeof record[field] === "string" && record[field].trim().length > 0
  );
}

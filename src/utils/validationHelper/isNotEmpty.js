export function isNotEmpty(value) {
  return Object.keys(value.trim() || "").length !== 0;
}

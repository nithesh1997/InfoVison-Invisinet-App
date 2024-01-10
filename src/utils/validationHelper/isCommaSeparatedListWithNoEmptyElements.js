export function isCommaSeparatedListWithNoEmptyElements(val) {
  /* val = val
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== ""); */
  return (
    val
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s === "").length === 0
  );
}

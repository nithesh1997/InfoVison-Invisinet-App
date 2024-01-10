export function validateAllGroupsFlag_No(groups, allDynGroup) {
  groups = groups.split(", ").filter((grp) => grp.trim() !== "");
  if (allDynGroup === "No" && groups.length === 0) {
    return false;
  }
  return true;
}

export function validateAllGroupsFlag_Yes(groups, allDynGroup) {
  groups = groups.split(", ").filter((grp) => grp.trim() !== "");
  if (allDynGroup === "Yes" && groups.length > 0) {
    return false;
  }
  return true;
}

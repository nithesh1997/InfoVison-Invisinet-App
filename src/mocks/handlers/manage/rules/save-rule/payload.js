export const payload = {
  success: {
    id: 1,
    action: "Forward",
    app: "",
    enabled: true,
    allDynGroup: 1,
    name: "Rule101",
    resource: "ProtectedResources101",
    protocol: "All",
    dynGroups: ["CHEIF", "ELDER", "LEADER", "MEMBER"],
    trustLevel: 5,
  },
  failure: {
    error: "error.post.restclient",
    errorMessage: "Error: Some Kinda Error ❌",
  },
};

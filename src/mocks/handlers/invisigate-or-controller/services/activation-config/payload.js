export const payload = {
  success: {
    id: 0,
    tr_enable: 1,
    tr_vlan: 24,
    tr_ip4: "198.18.18.1/24",
    tr_gw4: "198.18.18.1",
    tr_ip6: "",
    tr_gw6: "",
    ut_enable: 0,
    ut_vlan: 48,
    ut_ip4: "",
    ut_gw4: "",
    ut_ip6: "fe80::20c:29ff:fe86:74d9/48",
    ut_gw6: "fe80::20c:29ff:fe86:74d9",
    pad1: 0,
    gw_not_after: 4294967295,
    ca_not_after: 4294967295,
  },
  failure: {
    error: "error.get.restclient",
    errorMessage: "Error: Something went wrong...",
  },
};

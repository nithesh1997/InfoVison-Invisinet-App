export const payload = {
  success: {
    "192.168.31.101": {
      num_idents: 1000,
      max_conns: 40007,
      max_anon_conns: 20003,
      cluster_enable: 0,
      cluster_master: 0,
      under_vm: 1,
      chassis_id: 27,
      chassis_keypad: 0,
      chassis_lcd: 0,
      chassis_ipmi: 1,
      chassis_model: "2010",
    },
    "192.168.31.102": {
      num_idents: 1000,
      max_conns: 40007,
      max_anon_conns: 20003,
      cluster_enable: 0,
      cluster_master: 0,
      under_vm: 1,
      chassis_id: 27,
      chassis_keypad: 0,
      chassis_lcd: 0,
      chassis_ipmi: 1,
      chassis_model: "5010",
    },
  },
  failure: {
    error: "error.post.restclient",
    errorMessage: "Error: Some kinda error ❌",
  },
};

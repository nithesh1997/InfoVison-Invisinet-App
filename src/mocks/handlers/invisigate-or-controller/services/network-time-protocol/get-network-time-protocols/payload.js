export const payload = {
  success: [
    { server: "0.us.pool.ntp.org", status: "good", options: [""] },
    { server: "1.us.pool.ntp.org", status: "good", options: [""] },
    { server: "2.us.pool.ntp.org", status: "good", options: [""] },
    { server: "3.us.pool.ntp.org", status: "good", options: [""] },
  ],
  failure: {
    error: "error.get.restclient",
    errorMessage: "Error: Something went wrong...",
  },
};

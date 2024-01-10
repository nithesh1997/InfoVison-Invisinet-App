export const defaultAsyncHandler = (...args) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ isLoading: false, payload: [], error: "", success: "" });
    }, 5000);
  });
};

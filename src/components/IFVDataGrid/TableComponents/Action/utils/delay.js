export const delay = (ms = 2000) => {
  const t = Date.now() + ms;
  while (Date.now() < t) continue;
};

export const formatDate = (rawDate, diff = "-") => {
  rawDate = typeof rawDate !== "object" ? new Date(rawDate) : rawDate;
  const date = rawDate.getDate().toString();
  const month = (rawDate.getMonth() + 1).toString();
  const year = rawDate.getFullYear().toString();

  const prefixer = (param) => (param.length === 1 ? "0".concat(param) : param);

  return year + diff + prefixer(month) + diff + prefixer(date);
};

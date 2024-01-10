export const formatDateTime = ({
  rawDate,
  dateDiff = "-",
  timeDiff = ":",
  separator = "T",
  isMeridiam = null,
}) => {
  const date = rawDate.getDate().toString();
  const month = (rawDate.getMonth() + 1).toString();
  const year = rawDate.getFullYear().toString();
  const hour = rawDate.getHours();
  const localHour = (hour > 12 ? hour - 12 : hour).toString();
  const minutes = rawDate.getMinutes().toString();
  const meridiam = (isMeridiam ? (hour > 12 ? " PM" : " AM") : "").toString();
  const prefixer = (param) => (param.length === 1 ? `0${param}` : param);

  return (
    year +
    dateDiff +
    prefixer(month) +
    dateDiff +
    prefixer(date) +
    separator +
    prefixer(localHour) +
    timeDiff +
    prefixer(minutes) +
    meridiam.toUpperCase()
  );
};

// const DMY = `DD-MM-YYYY`
// const YDM = `YYYY-DD-MM`
// const MDY = `MM-DD-YYYY`
// const YMD = `YYYY-MM-DD`

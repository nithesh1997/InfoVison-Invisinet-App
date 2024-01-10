export const formatTime = (rawTime, diff = ":") => {
  const hour = rawTime.getHours();
  const localized = hour <= 12 ? hour : hour - 12;
  const minutes = rawTime.getMinutes();
  const light = hour <= 12 ? "AM" : "PM";

  return localized + diff + minutes + " " + light.toUpperCase();
};

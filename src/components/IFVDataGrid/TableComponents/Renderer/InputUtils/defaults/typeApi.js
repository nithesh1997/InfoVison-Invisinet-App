export const typeApi = (type) => {
  switch (type) {
    case "text":
      return "text";
    case "number":
      return "text";
    case "date":
      return "date";
    case "time":
      return "time";
    case "date-time":
      return "date-time";
    case "free-solo-single":
      return "dropdown-single";
    case "free-solo-multiple":
      return "dropdown-multiple";
    case "select-single":
      return "dropdown-single";
    case "select-multiple":
      return "dropdown-multiple";
    case "toggle":
      return "dropdown-single";

    default:
      return "";
  }
};

import { makeStyles } from "@material-ui/core";

export const useShrink = makeStyles((theme) => ({
  root: {
    "& .MuiFormLabel-root": {
      color: (theme) => theme.borderColorState,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    },
    "&:hover .MuiFormLabel-root": {
      color: ({ isDisabled }) => (isDisabled ? "#333" : "#0094FD"),
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: ({ isDisabled, borderColorState }) =>
        isDisabled ? "#333" : borderColorState,
      border: "1px solid",
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: ({ isDisabled }) => (isDisabled ? "#333" : "#0094FD"),
      border: "1px solid",
    },
    "& .MuiOutlinedInput-root.Mui-focusedMuiOutlinedInput-notchedOutline": {
      borderColor: ({ isDisabled, borderColorState }) =>
        isDisabled ? "#333" : borderColorState,
      border: "1px solid",
    },
  },
}));

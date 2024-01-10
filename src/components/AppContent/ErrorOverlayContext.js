import React, { createContext } from "react";
import { useTranslation } from "react-i18next";

const ErrorContext = createContext();

const ErrorContextProvider = (props) => {
  const { t, i18n } = useTranslation();
  const [errorText, setErrorText] = React.useState(
    t(`${t("commons.errorPage.title")}..!`),
  );
  const [errorDescription, setErrorDescription] = React.useState(() => (
    <span>
      {t("commons.errorPage.error.description.0")}
      <br />
      <br />
      {t("commons.errorPage.error.description.1")}
    </span>
  ));

  const initial = {
    errorText: errorText,
    errorDescription: errorDescription,
    setErrorText: (val) => setErrorText(val),
    setErrorDescription: (val) => setErrorDescription(val),
  };

  return <ErrorContext.Provider value={initial} children={props.children} />;
};

export { ErrorContext, ErrorContextProvider };
export default ErrorContext;

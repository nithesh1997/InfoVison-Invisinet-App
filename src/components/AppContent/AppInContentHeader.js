import React from "react";
import { withCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import Styled from "./MaterialComponents/AppInContentHeader.style";

const parseName = (word) => {
  const _word = word.toLocaleLowerCase().replace(/[^a-zA-Z0-9\s]/g, "");
  const $0 = _word.split(" ").filter((e) => e);
  const $1 = $0.splice(1).map((_) => _[0].toLocaleUpperCase() + _.slice(1));

  return [...$0, ...$1].join("");
};

const AppInContentHeader = (props) => {
  const { t, i18n } = useTranslation();

  const path_1 = parseName(props.breadcrumb.split(" > ")[0]);

  const breadcrumb_0 = path_1 === "gateway" ? "gatewayserver" : path_1;
  const breadcrumb_1 = parseName(props.breadcrumb.split(" > ")[1]);

  const $0 = t(`navigation.${breadcrumb_0}.text`);
  const $1 = t(`navigation.${breadcrumb_0}.sub.${breadcrumb_1}.text`);

  return (
    <Styled.Container>
      <Styled.TitleBox>{$1}</Styled.TitleBox>
      <Styled.TitleBreadcrumb>{`${$0} > ${$1}`}</Styled.TitleBreadcrumb>
    </Styled.Container>
  );
};

export default withRouter(withCookies(AppInContentHeader));

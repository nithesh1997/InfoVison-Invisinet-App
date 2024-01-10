import { Box, Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import { GenericButton } from "../../../../../style/GenericButton/GenericButton";
import { preProcessValidation } from "../../../../../utils/GeneralComponentNames";
import { Trans, useTranslation } from "react-i18next";
export const PopupFooter = ({ disabled, onAbort, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.ActionPrompt>
        <Trans
          i18nKey={"page.Endpoint.Configure.bulkTable.message"}
          components={[<b style={{ color: "#0094FD" }} />, <b />]}
        ></Trans>
      </Styled.ActionPrompt>
      <Styled.ActionWrapper>
        <GenericButton
          id={`${preProcessValidation}-cancel-button`}
          backgroundColor="secondary"
          buttonName={t("commons.cancelText")}
          disabled={false}
          onClick={onAbort}
        />

        <GenericButton
          id={`${preProcessValidation}-continue-button`}
          backgroundColor="primary"
          buttonName={t("commons.continueText")}
          disabled={disabled}
          onClick={onConfirm}
        />
      </Styled.ActionWrapper>
    </Styled.Wrapper>
  );
};

const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 168px;
    display: grid;
    place-items: center;
    box-sizing: border-box;
    @media (max-width: 768px) {
    }

    @media (max-width: 1200px) {
      height: 148px;
    }
  `,
  ActionPrompt: styled(Typography)`
    /* font-family: "Montserrat"; */
    font-weight: 500;
  `,
  ActionWrapper: styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 160px;
    gap: 2em;
    padding-bottom: 2.5em;
  `,
  ActionButton: styled(Button)`
    &.MuiButton-root {
      /* font-family: "Montserrat"; */
      font-weight: 600;
      text-transform: capitalize;
      border: 2px solid
        ${(props) => (props.variant === "outlined" ? "#333" : "#0094FD")};
      background: ${(props) =>
        props.variant === "outlined" ? "#0094FD00" : "#0094FD"};
      color: ${(props) => (props.variant === "outlined" ? "#333" : "#Fff")};
      min-width: 64px;
      height: 2.4rem;
      padding: 0.2em 2em;
    }

    &.MuiButton-root:hover {
      border: 2px solid
        ${({ variant }) => (variant === "outlined" ? "#333" : "#0074C7")};
      background: ${({ variant }) =>
        variant === "outlined" ? "#333" : "#0074C7"};
      color: #fff;
    }

    &.MuiButton-root.Mui-disabled {
      background: transparent;
      border: 2px solid #30303020;
      color: #30303090;
    }

    & .MuiTouchRipple-child {
      background: #67bcfa;
    }
  `,
};

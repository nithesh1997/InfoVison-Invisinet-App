import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import * as common from "../../common";

export const AddGatewayForm = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <Typography
          padding="0 1rem"
          variant="h6"
          fontWeight="600"
          fontFamily="Inter"
        >
          {t("commons.gateway.manage.add.title", {
            GATEWAY: common.GATEWAY,
            TAC_SERVER: common.TAC_SERVER,
          })}
        </Typography>

        <Typography padding="0 1rem" variant="body2" fontFamily="Inter">
          {t("commons.gateway.manage.add.info.0", {
            GATEWAY: common.GATEWAY,
            TAC_SERVER: common.TAC_SERVER,
          })?.toLowerCase()}{" "}
          <br /> {t("commons.gateway.manage.add.info.1")}
        </Typography>
      </Styled.Header>

      <Styled.Body>
        <Box style={{ width: "400px" }}>
          <Styled.InputField
            fontFamily="Inter"
            fullWidth
            variant="outlined"
            margin="normal"
            type="text"
            class="form-control"
            id="gatewayaddress"
            aria-describedby="emailHelp"
            placeholder={t("commons.gateway.manage.add.inputLabel", {
              GATEWAY: common.GATEWAY,
              TAC_SERVER: common.TAC_SERVER,
            })}
            style={{ width: "400px" }}
            defaultValue={""}
            value={props.address}
            onChange={props.handleChangeAddress}
            disabled={!props.isAttemptOnGoing ? "" : "true"}
            inputRef={props.inputForAddressRef}
            onBlur={props.handleAddressBlur}
            onFocus={props.handleAddressFocus}
          />
          <Styled.HelperText>{props.addressHelperText}</Styled.HelperText>
        </Box>
      </Styled.Body>

      <Styled.Footer>
        <GenericButton
          id={`${props.gateway}-addGateway-cancel-button`}
          width={"11rem"}
          backgroundColor="secondary"
          buttonName={t("commons.cancelText")}
          disabled={props.isAttemptOnGoing}
          onClick={() => {
            props.resetFields();
            props.handleClose("close");
          }}
        />

        <GenericButton
          id={`${props.gateway}-addGatewayPortal-addGateway-button`}
          width={i18n.language === "es" ? "14rem" : "13rem"}
          buttonName={t("commons.gateway.manage.add.title", {
            GATEWAY: common.GATEWAY,
            TAC_SERVER: common.TAC_SERVER,
          })}
          backgroundColor={"primary"}
          disabled={
            props.isAttemptOnGoing ||
            props.gatewayNameError ||
            props.addressError
          }
          onClick={props.handleSubmit}
          buttonRef={props.buttonForSaveRef}
        />
      </Styled.Footer>
    </Styled.Wrapper>
  );
};

const Styled = {
  Wrapper: styled(Box)`
    height: 80%;
    /* border: 1px solid #dcdcdc; */
    border-radius: 1rem;
    width: 512px;
    overflow: hidden;
    display: grid;
    grid-template-rows: 30% 50% 20%;
  `,
  HeaderWrapper: styled(Box)`
    height: 88px;
    padding: 0.4rem 1rem;
  `,
  HeaderContent: styled(Box)`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  BodyWrapper: styled(Box)`
    display: flex;
    flex-direction: column;
  `,
  BodyContent: styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem 1rem;
  `,
  FooterWrapper: styled(Box)`
    width: 90%;
    height: 40%;
    display: grid;
    place-items: center;
  `,
  FooterContent: styled(Box)`
    width: 80%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  `,
  InputField: styled(TextField)`
    font-size: 13px;
    line-height: 14px;
    margin-bottom: 8px;
    padding: 12px;
    color: rgb(0, 0, 0);
    display: block;
    width: 100%;
    outline: none;
    background-color: rgb(255, 255, 255);
    background-clip: padding-box;
    border: 1px solid rgb(206, 212, 218);
    appearance: none;
    /* font-family: Montserrat, sans-serif; */
    font-weight: 400;
    align-self: center;

    &:focus {
      border-color: #018ff6;
    }
  `,
  HelperText: styled(Box)`
    color: #ef4444;
    width: 100%;
    height: 2px;
    /* font-family: Montserrat; */
    // overflow-y: auto;
    // font-size: 10px;
    border-radius: 0.2rem;
    padding: 0rem;
    margin: 0.3rem 0.89rem;
    font-size: 0.75rem;
    font-weight: 600;
  `,
  Header: styled(Box)`
    padding: 0.1rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  `,
  Body: styled(Box)`
    padding: 0.6rem 1rem;
    display: grid;
    place-items: center;
  `,
  Footer: styled(Box)`
    padding: 0.1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  `,
};

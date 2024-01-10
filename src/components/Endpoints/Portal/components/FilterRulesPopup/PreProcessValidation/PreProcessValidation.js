import { Box, Typography } from "@material-ui/core";
import { Styled } from "./PreProcessValidation.Styled";
import PreProcessValidationTable from "./PreProcessValidationTable";
import { Trans, useTranslation } from "react-i18next";

const PreProcessValidation = ({
  disabled,
  actionCancelHandler,
  actionContinueHandler,
  EpcCheckState,
  eligibleRows,
  inEligibleRows,
  inEligibleIndics,
  loading = "",
}) => {
  const [EPC_CheckState, setEPC_CheckState] = EpcCheckState;
  const { t } = useTranslation();
  return (
    <Styled.Wrapper>
      <Styled.PreProcessTableWrapper>
        <Styled.EligibleTableWrapper>
          <PreProcessValidationTable
            EPC_CheckState={EPC_CheckState}
            logs={inEligibleRows}
            inEligibleIndics={inEligibleIndics}
            loading={loading}
          />
        </Styled.EligibleTableWrapper>

        <Styled.NotEligibleTableWrapper>
          <PreProcessValidationTable
            isEligible
            EPC_CheckState={EPC_CheckState}
            logs={eligibleRows}
            loading={loading}
          />
        </Styled.NotEligibleTableWrapper>
      </Styled.PreProcessTableWrapper>

      <Styled.ActionWrapper>
        <Box>
          <Typography /* style={{ fontFamily: "Montserrat" }} */>
            <Trans
              i18nKey={"page.Endpoint.Configure.bulkTable.message"}
              components={[<b />]}
            >
              Click <b style={{ color: "#0094FD" }}>CONTINUE</b> to proceed.
              Click
              <b style={{ color: "" }}> CANCEL</b> to return to Endpoints
              screen.
            </Trans>
          </Typography>
        </Box>

        <Styled.ActionSubWrapper>
          <Styled.ActionCancel onClick={actionCancelHandler} variant="outlined">
            {t("page.Endpoint.Configure.bulkTable.cancelButton")}
          </Styled.ActionCancel>

          <Styled.ActionContinue
            disabled={disabled}
            onClick={actionContinueHandler}
            variant="contained"
          >
            {t("page.Endpoint.Configure.bulkTable.continueButton")}
          </Styled.ActionContinue>
        </Styled.ActionSubWrapper>
      </Styled.ActionWrapper>
    </Styled.Wrapper>
  );
};

export default PreProcessValidation;

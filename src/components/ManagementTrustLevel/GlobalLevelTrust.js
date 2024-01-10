import React, { useContext, useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import callAPI from "../../apis/callAPI";
import { getTrustLevelApiResponders } from "../../apis/responders/getTrustLevelApiResponders";
import TrustLogo from "../../images/trust.png";
import Utility from "../../redux/actions/Utility";
import OverlayContext from "../AppContent/AppOverlayContext";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import Styled from "./MaterialComponents/GlobalLevelTrust.style";
import { trustLevel } from "../../utils/GeneralComponentNames";
import { GenericButton } from "../../style/GenericButton/GenericButton";
import { EditRounded } from "@mui/icons-material";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import DoneSharpIcon from "@material-ui/icons/DoneSharp";
import { useTranslation } from "react-i18next";
import Prompt from "../DeletePrompt/Prompt";

const GlobalLevelTrust = (props) => {
  const [switchLevel, setSwitchLevel] = useState({
    display: true,
    cursor: false,
    disable: true,
    disableCancel: false,
  });
  const [newTrust, setNewTrust] = useState();
  const [selectedTrust, setSelectedTrust] = useState("");
  const [switchTrust, setSwitchTrust] = useState("");

  const [loading, setLoading] = useState(false);
  const AppOverlayContext = useContext(OverlayContext);

  const [prompt, setPrompt] = useState(false);
  const [message, setMessage] = useState("");

  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();
  const [error, setError] = useState(
    t("commons.errorMessages.errorSwitchingGlobalTrust"),
  );
  useEffect(() => {
    if (typeof props.trustData === "object" && props.trustData !== null) {
      if (typeof props.trustData.trustLevel === "string") {
        setNewTrust(props.trustData.trustLevel);
        setSelectedTrust(props.trustData.trustLevel);
        setSwitchTrust("view");
      } else {
        setNewTrust("");
        setSelectedTrust("");
        setSwitchTrust("");
      }
    } else {
      setNewTrust("");
      setSelectedTrust("");
      setSwitchTrust("");
    }
  }, [props.trustData.trustLevel]);

  // Edit Handler
  const onEditChangeHandler = () => {
    setSwitchLevel((prevState) => {
      return {
        ...prevState,
        cursor: true,
        display: false,
        disableCancel: false,
      };
    });
    setSwitchTrust("save disable");
    setSwitchLevel((prevState) => {
      return { ...prevState, disable: true };
    });
  };
  // CancelHandler
  const onCancelChangeHandler = () => {
    setSwitchLevel((prevState) => {
      return { disable: true, display: true, cursor: false };
    });
    setNewTrust(selectedTrust);
    setSwitchTrust("view");
  };

  // level 0
  const onchangeTrustzero = () => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("0");
    }
    if (selectedTrust === "0") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // level 1
  const onchangeTrustone = () => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("1");
    }
    if (selectedTrust === "1") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });

      setSwitchTrust("save enable");
    }
  };
  // level 2
  const onChangeTrustTwo = () => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("2");
    }
    if (selectedTrust === "2") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Level 3
  const onChangeTrustThree = () => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("3");
    }
    if (selectedTrust === "3") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Level 4
  const onChangeTrustFour = () => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("4");
    }
    if (selectedTrust === "4") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Level 5
  const onchangeTrustFive = (event) => {
    if (!switchLevel.cursor) {
      return;
    } else setNewTrust("5");

    if (selectedTrust === "5") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Level 6
  const onchangeTrustsix = (event) => {
    if (!switchLevel.cursor) {
      return;
    } else {
      setNewTrust("6");
    }
    if (selectedTrust === "6") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Level 7
  const onChangeTrustSeven = () => {
    if (!switchLevel.cursor) {
      return;
    }
    setNewTrust("7");
    if (selectedTrust === "7") {
      setSwitchTrust("save disable");
      setSwitchLevel((prevState) => {
        return { ...prevState, disable: true };
      });
    } else {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disable: false,
        };
      });
      setSwitchTrust("save enable");
    }
  };
  // Apply Handler
  const onApplyHandler = () => {
    // setSelectedTrust(newTrust);
    // setTimeout(() => {
    //     setLoading(false);
    //     setSwitchTrust("saved");
    // }, 2000);
    callAPI({
      path: "saveTrustLevel",
      params: {
        gatewayIP: AppOverlayContext.selectedGateway.address,
        /* trustLevel: {
          newTrust,
        }, */
      },
      data: {
        trustLevel: newTrust,
      },
      responder: getTrustLevelApiResponders,
      onComplete: onCompleteTrustLevelResponders,
    });
    setSwitchTrust("saving");
    setLoading(true);
    setSwitchLevel((prevState) => {
      return {
        ...prevState,
        disable: true,
        cursor: false,
        disableCancel: true,
      };
    });
  };
  const onCompleteTrustLevelResponders = (responder) => {
    if (responder.code === 204) {
      setSwitchLevel((prevState) => {
        return {
          ...prevState,
          disableCancel: false,
          display: true,
          cursor: false,
        };
      });
      setSelectedTrust(newTrust);
      setLoading(false);
      setTimeout(() => {
        setSwitchTrust((oldState) =>
          oldState === "saved" ? "view" : oldState,
        );
      }, 4000);
      setSwitchTrust("saved");
    } else {
      setPrompt(true);
      setMessage(
        <>
          {t("commons.errorMessages.errorSwitchingGlobalTrust")}
          <br />
          {t("commons.errorMessages.errorDetails")}
          <br />
          {Utility.getErrorsFromResponse(responder, true).join("\n- ")},
        </>,
      );
      // Ensure below happens only after close of above alert.
      setSwitchLevel((prev) => {
        return {
          ...prev,
          disableCancel: false,
          display: false,
          disable: false,
          cursor: true,
        };
      });
      setLoading(false);
      setTimeout(() => {
        setSwitchTrust((oldState) =>
          oldState === "error" ? "view" : oldState,
        );
      }, 4000);
      setSwitchTrust("error");
    }
  };

  function helpTextGenerator(switchTrust, selectedTrust, newTrust, error) {
    if (switchTrust === "view") {
      return t("page.manage.Trust Level.ViewHelperText", { selectedTrust });
    } else if (switchTrust === "save disable") {
      return t("page.manage.Trust Level.Disable", { selectedTrust });
    } else if (switchTrust === "save enable") {
      return t("page.manage.Trust Level.SaveEnable", { newTrust });
    } else if (switchTrust === "saving") {
      return t("page.manage.Trust Level.Saving", { selectedTrust, newTrust });
    } else if (switchTrust === "saved") {
      return (
        <Styled.StyledMsg>
          {t("page.manage.Trust Level.Saved", { newTrust })}
        </Styled.StyledMsg>
      );
    } else if (switchTrust === "error") {
      return (
        <Styled.StyledErr>
          {t("page.manage.Trust Level.Error", { selectedTrust, newTrust })}
        </Styled.StyledErr>
      );
    } else {
      return "";
    }
  }

  return (
    <React.Fragment>
      <Styled.StyledBoxHeader>
        <Styled.StyledTextHead>
          {t("page.manage.Trust Level.Text Heading Icons")}
        </Styled.StyledTextHead>
        <Styled.StyledTextandButtonHandler>
          <Styled.StyledGlobalModeText>
            {helpTextGenerator(switchTrust, selectedTrust, newTrust, error)}
          </Styled.StyledGlobalModeText>
          {props.loading ? (
            ""
          ) : switchLevel.display ? (
            <GenericButton
              id={`${trustLevel}-edit-button`}
              buttonName={t("page.manage.Trust Level.EditButton")}
              disabled={false}
              onClick={onEditChangeHandler}
              backgroundColor="primary"
              Icon={<EditRounded style={{ width: "0.8em", height: "0.8em" }} />}
            />
          ) : (
            <Styled.ButtonGroup>
              {" "}
              {loading ? (
                <ClipLoader style={{ marginLeft: "100px" }} size="1.5em" />
              ) : (
                ""
              )}
              <GenericButton
                id={`${trustLevel}-edit-apply-button`}
                backgroundColor="primary"
                buttonName={t("page.manage.Trust Level.ApplyButton")}
                Icon={
                  <DoneSharpIcon style={{ width: "0.8em", height: "0.8em" }} />
                }
                disabled={switchLevel.disable}
                onClick={onApplyHandler}
              />
              <GenericButton
                buttonName={t("page.manage.Trust Level.CancelButton")}
                id={`${trustLevel}-edit-cancel-button`}
                disabled={switchLevel.disableCancel}
                onClick={onCancelChangeHandler}
                backgroundColor="secondary"
                Icon={
                  <ClearSharpIcon style={{ width: "0.8em", height: "0.8em" }} />
                }
              />
            </Styled.ButtonGroup>
          )}{" "}
        </Styled.StyledTextandButtonHandler>
      </Styled.StyledBoxHeader>
      {props.loading ? (
        <Styled.StyledWidthFillerSkeleton>
          <WidthFillerSkeleton height="100" />
        </Styled.StyledWidthFillerSkeleton>
      ) : (
        <>
          <Styled.ScrollingWrapper>
            <Styled.StyledBox>
              <Styled.GlobalWrapper
                id={`trust_0`}
                onClick={onchangeTrustzero}
                className={
                  newTrust === "0"
                    ? "selected"
                    : selectedTrust === "0"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level0")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_1`}
                onClick={onchangeTrustone}
                className={
                  newTrust === "1"
                    ? "selected"
                    : selectedTrust === "1"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level1")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_2`}
                onClick={onChangeTrustTwo}
                className={
                  newTrust === "2"
                    ? "selected"
                    : selectedTrust === "2"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level2")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_3`}
                onClick={onChangeTrustThree}
                className={
                  newTrust === "3"
                    ? "selected"
                    : selectedTrust === "3"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level3")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 style={{ backgroundColor: "" }} />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_4`}
                onClick={onChangeTrustFour}
                className={
                  newTrust === "4"
                    ? "selected"
                    : selectedTrust === "4"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level4")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_5`}
                onClick={onchangeTrustFive}
                className={
                  newTrust === "5"
                    ? "selected"
                    : selectedTrust === "5"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level5")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_6`}
                onClick={onchangeTrustsix}
                className={
                  newTrust === "6"
                    ? "selected"
                    : selectedTrust === "6"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level6")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>

              <Styled.GlobalWrapper
                id={`trust_7`}
                onClick={onChangeTrustSeven}
                className={
                  newTrust === "7"
                    ? "selected"
                    : selectedTrust === "7"
                    ? "unselected"
                    : ""
                }
                cursor={switchLevel.cursor}
              >
                <Styled.ImageLevelBox>
                  <Styled.StyledImageBanner
                    src={TrustLogo}
                    width={"32"}
                    alt="trust_0"
                  />
                  <Styled.StyledPaper variant="outlined">
                    <Styled.StyledTypography>
                      {t("page.manage.Trust Level.Level7")}
                    </Styled.StyledTypography>
                  </Styled.StyledPaper>
                </Styled.ImageLevelBox>
                <Styled.StyledPaper2 />
              </Styled.GlobalWrapper>
            </Styled.StyledBox>
          </Styled.ScrollingWrapper>
        </>
      )}{" "}
      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={t("commons.errorText")}
        contentText={message}
        contentInfo={``}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setPrompt(false)}
      />
    </React.Fragment>
  );
};
export default GlobalLevelTrust;

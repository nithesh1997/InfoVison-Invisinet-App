import { IconButton, InputAdornment } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { withStyles } from "@material-ui/styles";
import { Box } from "@mui/system";
import React, { useContext, useRef, useState } from "react";
import { ExclamationTriangle } from "react-bootstrap-icons";
import { withCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import callAPI from "../../apis/callAPI";
import { signInAPIResponder } from "../../apis/responders/sign-in-api-responder";
import Config from "../../Config";
import { setUserProfile } from "../../redux/Slices/userProfileSlice";
import ImageBanner from "../General/ImageBanner";
import { Images } from "../../NamedImages/NamedImages";
import { useTranslation } from "react-i18next";

const CssTextField = withStyles({
  root: {
    "::-ms-reveal": {
      display: "none",
    },
    "& .MuiOutlinedInput-root.Mui-error": {
      "&.Mui-focused fieldset": {
        borderColor: "red",
      },
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#018ff6",
      },
    },
  },
})(TextField);

const StyledSubmitComponent = styled(Button)`
  margin: 3px, 0px, 2px;
  font-weight: 500;
  margin-top: 1rem;
  font-size: 16px;
  color: #fff;
  background-color: #0094fd;
  border-color: #0094fd;
  border-radius: 50rem !important;
  float: right !important;
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
  padding-right: 3rem !important;
  padding-left: 3rem !important;
  text-transform: capitalize;
  align-self: flex-end;

  @media (min-width: 641px) and (max-width: 768px) {
    align-self: center;
  }
`;

const StyledImageBannerComponent = styled(ImageBanner)`
  margin-bottom: 3rem;
  align-self: flex-start;

  @media (min-width: 641px) and (max-width: 768px) {
    align-self: center;
  }
`;

const StyledTypographyComponent = styled(Typography)`
  color: #018ff6;
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
  text-transform: capitalize;
  margin-bottom: 1.5rem !important;
  align-self: flex-start;
`;

const StyledSpanComponent = styled.span`
  color: #333;
  vertical-align: text-bottom;
  padding-left: 5px;
  text-transform: capitalize;
  font-family: Inter;
`;

const StyledSecurityCheckLogOutMessage = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin: 0.25em 0em;
  padding: 0.75em;
  border-radius: 0.5em;
  background-color: rgba(1, 143, 246, 0.2);
  text-align: center;
  color: #333;
  font-weight: 400;
  font-size: 1.25em;
  text-align: left;

  @media (min-width: 641px) and (max-width: 768px) {
    width: auto;
  }
`;

const Styleddiv = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1.5fr;
  grid-template-rows: 100vh;
  overflow-y: auto;

  @media (min-width: 641px) and (max-width: 768px) {
    width: 100%;
    min-height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: url(${Images.loginBg}) no-repeat 0 0;
    background-position: right -26px bottom -788px;
    overflow-y: auto;
  }
`;
const StyledInnerdiv = styled(Box)`
  display: grid;
  grid-template-columns: 1.5fr;
  justify-items: center;
  align-items: center;
  width: 500px;

  @media (min-width: 641px) and (max-width: 768px) {
    width: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const StyledGridContainer = styled(Box)`
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url(${Images.loginBg}) no-repeat 0 0;
  background-size: cover;
  clip-path: polygon(0 0, 100% 0, 87% 100%, 0% 100%);
  position: none;

  @media (max-width: 1024px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
  }

  @media (min-width: 641px) and (max-width: 768px) {
    background: none;
    height: auto;
    width: 100%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
`;
const LoginTextBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  background: #fff;
  height: 568px;

  @media (min-width: 641px) and (max-width: 768px) {
    width: 360px;
    background: #fff;
    align-self: flex-start;
    min-height: 568px;
    border-radius: 1em;
    padding: 1em;
  }
`;
const StyledTypo = styled(Box)`
  margin: 0em 0 14rem 5rem;
  @media (min-width: 641px) and (max-width: 768px) {
    margin: 0em;
  }
`;
const StyledCssTextField = styled(TextField)`
  input::-ms-clear,
  input::-ms-reveal {
    display: none;
  }
`;
const SignInNew = (props) => {
  const { t, i18n } = useTranslation();
  let [identity, setIdentity] = useState("");
  let [isAttemptOnGoing, setIsAttemptOnGoing] = useState(false);
  let [identityError, setIdentityError] = useState(false);
  let [identityHelperText, setIdentityHelperText] = useState("");
  let [password, setPassword] = useState("");
  let [passwordError, setPasswordError] = useState(false);
  let [passwordHelperText, setPasswordHelperText] = useState("");
  let [attemptError, setAttemptError] = useState(false);
  let [attemptErrorText, setAttemptErrorText] = useState("");
  let [display, setDisplay] = useState("none");
  const [showPassword, setShowPassword] = useState(false);
  const [warning, setWarning] = useState(false);
  const identityInputRef = useRef();
  const AppConfig = useContext(Config);
  const textFieldForUsernameRef = React.useRef(null);
  const textFieldForPasswordRef = React.useRef(null);
  const buttonForLoginRef = React.useRef(null);
  const handleMouseUpShowPassword = () => setShowPassword(false);
  const handleMouseDownPassword = () => setShowPassword(true);
  const dispatch = useDispatch();

  const notAllowedUSers = ["pwreset", "mfg"];

  const onKeyDown = (keyEvent) => {
    if (keyEvent.getModifierState("CapsLock")) {
      setWarning(true);
      setDisplay("block");
    } else {
      setWarning(false);
      setDisplay("none");
    }
  };

  const signinOnCompleteHandler = (response) => {
    if (response.state === "LOGIN_SUCESS" && response.data !== "") {
      setAttemptError(false);
      setAttemptErrorText("");
      dispatch(setUserProfile({ name: identity, role: "Administrator" }));

      let user = identity;
      user = user.length < 0 ? "Unknown" : user;
      sessionStorage.setItem("sessionName", user);

      let location = JSON.parse(JSON.stringify(props.location));
      let search = new URLSearchParams(location.search);
      let ret = search.get("return");

      if (ret !== null) {
        try {
          ret = JSON.parse(window.decodeURIComponent(ret));
        } catch (err) {
          ret = null;
        }
      }

      if (ret === null) {
        location = {};

        location.pathname = AppConfig.pages.dsh.path;
        location.search = new URLSearchParams();
      } else {
        location = ret;

        location.search = new URLSearchParams(location.search);
      }

      if (location.pathname === "/") {
        location.pathname = AppConfig.pages.dsh.path;
      }

      location.search = location.search.toString();
      props.history.push(location);
    } else {
      setAttemptError(true);
      setAttemptErrorText(response.errorMessage);

      let input = identityInputRef.current.getElementsByTagName("input");
      input && input[0].focus();

      setIsAttemptOnGoing(false);
    }
  };

  const attemptSignIn = () => {
    setIsAttemptOnGoing(true);
    const userName = identity;

    if (notAllowedUSers.includes(userName.toLowerCase())) {
      const errorText = t("commons.login.warning.restricted", { userName });
      setAttemptError(true);
      setAttemptErrorText(errorText);

      let input = identityInputRef.current.getElementsByTagName("input");
      input && input[0].focus();

      setIsAttemptOnGoing(false);
    } else {
      callAPI({
        path: "sign-in",
        data: { userName, password },
        responder: signInAPIResponder,
        onComplete: signinOnCompleteHandler,
      });
    }
  };

  return (
    <Styleddiv>
      <StyledGridContainer>
        <StyledTypo>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "20px",
              margin: "0rem 8rem 0rem 0rem",
            }}
          >
            {t("page.signIn.greetMessage.0")}
          </div>

          <div style={{ color: "#FFFFFF", fontSize: "46px" }}>
            {t("page.signIn.greetMessage.1")}
          </div>
        </StyledTypo>
      </StyledGridContainer>

      <StyledInnerdiv>
        <LoginTextBox>
          <StyledImageBannerComponent
            src={Images.invisinetLogo}
            height={38}
            alt={"InvisiNet"}
          />

          <StyledTypographyComponent component="h1" variant="h5">
            {t("commons.login.title")}
          </StyledTypographyComponent>

          <StyledSecurityCheckLogOutMessage
            className={
              new URLSearchParams(props.location.search).get(
                "securityCheckLogOut",
              ) === "true"
                ? ""
                : "hidden"
            }
          >
            {t("commons.logout.overtime.message")}
          </StyledSecurityCheckLogOutMessage>

          <CssTextField
            ref={identityInputRef}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="identity"
            label={t("page.signIn.userName")}
            name="identity"
            autoComplete="identity"
            value={identity}
            error={identityError}
            helperText={identityHelperText}
            disabled={!isAttemptOnGoing ? "" : "true"}
            inputRef={textFieldForUsernameRef}
            autoFocus
            inputProps={{
              onKeyPress: ({ key }) => {
                if (key === "Enter" && identity.length !== 0) {
                  textFieldForPasswordRef.current.focus();
                }
              },
            }}
            onChange={(evt) => {
              let val = evt.target.value;
              setIdentity(val);

              if (val.length < 1) {
                setIdentityHelperText(t("page.signIn.userHelperText"));
                setIdentityError(true);
              } else {
                setIdentityHelperText("");
                setIdentityError(false);
              }
            }}
          />

          <StyledCssTextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label={t("page.signIn.password")}
            id="password"
            value={password}
            autoComplete="current-password"
            error={passwordError}
            helperText={passwordHelperText}
            disabled={!isAttemptOnGoing ? "" : "true"}
            type={!showPassword ? "password" : "text"}
            inputRef={textFieldForPasswordRef}
            onKeyDown={onKeyDown}
            onChange={(evt) => {
              let val = evt.target.value;
              setPassword(val);
              if (val.length < 1) {
                setPasswordHelperText(t("page.signIn.passwordHelperText"));
                setPasswordError(true);
              } else {
                setPasswordHelperText("");
                setPasswordError(false);
              }
            }}
            inputProps={{
              maxLength: 30,
              onKeyPress: (event) => {
                const { key } = event;

                if (key === "Enter" && password.length !== 0) {
                  buttonForLoginRef.current.click();
                }
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {warning && (
                    <ExclamationTriangle style={{ color: "#018ff6" }} />
                  )}
                  <IconButton
                    aria-label="toggle password visibility"
                    onMouseUp={handleMouseUpShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon style={{ color: "#333" }} />
                    ) : (
                      <VisibilityOutlinedIcon style={{ color: "#333" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {warning && (
            <div style={{ alignSelf: "flex-start" }}>
              <ExclamationTriangle style={{ color: "#018ff6" }} />
              <StyledSpanComponent>
                {t("page.signIn.CapsLock")}
              </StyledSpanComponent>
            </div>
          )}

          <div error={attemptError} style={{ color: "red" }}>
            {attemptErrorText}
          </div>

          <StyledSubmitComponent
            id="loginbutton"
            type="button"
            width="initial"
            variant="contained"
            color="primary"
            disabled={
              !!!identity ||
              !!!password ||
              identityError ||
              passwordError ||
              isAttemptOnGoing
            }
            onClick={attemptSignIn}
            buttonRef={buttonForLoginRef}
          >
            {t("commons.login.title")}
          </StyledSubmitComponent>
        </LoginTextBox>
      </StyledInnerdiv>
    </Styleddiv>
  );
};

export default withRouter(withCookies(SignInNew));

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { createTheme } from "@mui/material/styles";
import styled from "styled-components";
import { HyperLink } from "../HyperLinks/HyperLink";
import { InfoCircle } from "react-bootstrap-icons";
import Tooltip from "../../utils/Tooltip/Tooltip";

export const GlobalCard = ({
  title,
  content,
  isToggleActive,
  toggleHandler,
  toggleName,
  toggleShow,
  info,
  ...props
}) => {
  return (
    <Card theme={theme} {...props}>
      <CardTitle>
        <HyperLink style={styleTitle} hyperLinkName={title} href="#" />

        <CardToolBar>
          {title === "Statistics" && (
            <Toggler>
              {toggleShow === "5010" ? (
                <StyleToogleStats
                  toggleShow={toggleShow}
                  color={toggleName === "Untrusted" ? `#333` : `#4B5563`}
                  backgroundColor={
                    toggleName === "Untrusted" ? `#f9fafb` : `#f9fafb00`
                  }
                  hyperLinkName="Untrusted"
                  onClick={toggleHandler}
                />
              ) : (
                <>
                  <HyperLink
                    style={styleToogleButton}
                    color={toggleName === "Trusted" ? `#333` : `#4B5563`}
                    backgroundColor={
                      toggleName === "Trusted" ? `#f9fafb` : `#f9fafb00`
                    }
                    hyperLinkName="Trusted"
                    onClick={toggleHandler}
                  />
                  <HyperLink
                    style={styleToogleButton}
                    color={toggleName === "Untrusted" ? `#333` : `#4B5563`}
                    backgroundColor={
                      toggleName === "Untrusted" ? `#f9fafb` : `#f9fafb00`
                    }
                    hyperLinkName="Untrusted"
                    onClick={toggleHandler}
                  />
                </>
              )}
            </Toggler>
          )}

          {title === "Services" && (
            <Toggler>
              <HyperLink
                style={styleToogleButton}
                color={toggleName === "bump0" ? `#333` : `#4B5563`}
                backgroundColor={
                  toggleName === "bump0" ? `#f9fafb` : `#f9fafb00`
                }
                hyperLinkName="bump0"
                onClick={toggleHandler}
              />
              <HyperLink
                style={styleToogleButton}
                color={toggleName === "mgt" ? `#333` : `#4B5563`}
                backgroundColor={toggleName === "mgt" ? `#f9fafb` : `#f9fafb00`}
                hyperLinkName="mgt"
                onClick={toggleHandler}
              />
            </Toggler>
          )}

          <Tooltip label={info} placement="bottom">
            <Icon>
              <InfoCircle size={"0.65em"} />
            </Icon>
          </Tooltip>
        </CardToolBar>
      </CardTitle>
      <CardContent>{content}</CardContent>
    </Card>
  );
};
const theme = createTheme({
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          width: "100%",
          hieght: "auto",
          background: "#FFFFFF",
          boxShadow:
            "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
          borderRadius: "0.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          background: "red",
          padding: 0,
        },
      },
    },
  },
});

const CardTitle = styled.h2`
  max-width: 100%;
  margin: 0;
  padding: 0.5em 0.75em 0.5em 1.5em;
  display: flex;
  justify-content: space-between;
`;

const CardToolBar = styled.div`
  display: flex;
`;

const StyleToogleStats = styled(HyperLink)`
  box-shadow: 0px 0px 16px -10px;
  border-radius: 0.2em;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 400;
  padding: 0.2rem;
  pointer-events: ${(props) =>
    props.toggleShow !== "Model 5010" ? "none" : "auto"};
`;

const Toggler = styled.div`
  border-radius: 0.2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #14386840;
  box-shadow: inset 0px 0px 16px -10px;
  padding: 0 0.2em 0.1em;
  gap: 0.5rem;
`;

const Icon = styled.div`
  width: 1.3em;
  height: 1.3em;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-top: 0.2rem;
  cursor: pointer;
  &:hover {
    background-color: #d6eeff;
  }
`;

const styleTitle = {
  color: "#000000",
  textAlign: "left",
  fontSize: "0.875rem",
  fontWeight: 600,
  wordBreak: "break all",
  margin: 0,
  textDecoration: "none",
};

const styleToogleButton = {
  boxShadow: "0px 0px 16px -10px",
  borderRadius: "0.2em",
  textDecoration: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  fontWeight: 400,
  padding: "0.2rem",
};

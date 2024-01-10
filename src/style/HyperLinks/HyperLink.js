import React from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { Link } from "@mui/material";

const initProps = {
  // variant: "body1",
  href: "#",
  underline: "hover",
  onClick: (event) => alert("The Button Action is not configured..!"),
};

export const HyperLink = ({ hyperLinkName, ...props }) => {
  return (
    <Styled.LinkWrapper>
      <Link hyperLinkName={hyperLinkName} {...initProps} {...props}>
        {hyperLinkName}
      </Link>
    </Styled.LinkWrapper>
  );
};

const Styled = {
  LinkWrapper: styled(Box)`
    display: "flex";
    flex-wrap: "wrap";
    justify-content: "center";
  `,
  Link: styled(Link)`
    &.MuiLink-root {
      width: 30px;
      height: 20px;
      /* font-family: "Montserrat"; */
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      /* line-height: 20px; */
      color: #0094fd;
      flex: none;
      order: 0;
      flex-grow: 0;
    }

    &.MuiLink-root:hover {
      background: #0074c7;
      color: #0074c7;
    }

    &.MuiLink-root.Mui-disabled {
      background: #f0f0f0;
      border: 10px solid #f0f0f0;
      color: #a6a6a6;
    }
  `,
};

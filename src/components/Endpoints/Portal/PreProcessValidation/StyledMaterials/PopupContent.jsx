import { Box } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Table } from "./Table";

export const PopupContent = ({
  qualifiedRecords,
  unQualifiedRecords,
  loading,
  isUpgradeRemoteFirmware,
}) => {
  const columns = ["Endpoint Name", "Endpoint Serial"];

  return (
    <Styled.Wrapper>
      <Styled.SubWrapper>
        <Styled.BadTableWrapper>
          <Table
            loading={loading}
            columns={["Endpoint Name", "Endpoint Serial", "Cause"]}
            rows={unQualifiedRecords}
            unQualified
          />
        </Styled.BadTableWrapper>

        <Styled.GoodTableWrapper>
          <Table
            loading={loading}
            columns={columns}
            rows={qualifiedRecords}
            isUpgradeRemoteFirmware={isUpgradeRemoteFirmware}
          />
        </Styled.GoodTableWrapper>
      </Styled.SubWrapper>
    </Styled.Wrapper>
  );
};

export const Styled = {
  Wrapper: styled(Box)`
    width: 100%;
    height: 80%;
    box-sizing: border-box;
    display: grid;
    place-items: center;
    @media (max-width: 768px) {
      height: 80%;
      display: grid;
      place-items: initial;
      overflow-y: scroll;
    }
    @media (max-width: 1024px) {
      height: 80%;
      display: grid;
      place-items: initial;
      overflow-y: scroll;
    }
    @media (max-width: 1200px) {
      height: 80%;
      display: grid;
      place-items: initial;
      overflow-y: scroll;
    }
  `,
  SubWrapper: styled(Box)`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
    }
  `,
  BadTableWrapper: styled(Box)`
    width: 660px;
    height: 380px;
    border-radius: 1em;
    box-sizing: border-box;
    @media (max-width: 768px) {
      height: auto;
    }
  `,
  GoodTableWrapper: styled(Box)`
    width: 660px;
    height: 380px;
    border-radius: 1em;
    box-sizing: border-box;

    @media (max-width: 768px) {
      height: auto;
    }
  `,
};

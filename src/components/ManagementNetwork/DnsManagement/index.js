import { Box } from "@mui/system";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import callAPI from "../../../apis/callAPI";
import { networkAPIResponder } from "../../../apis/responders/networkAPIResponder";
import Config from "../../../Config";
import summary_10 from "../../../images/summary_10.svg";
import summary_11 from "../../../images/summary_11.svg";
import summary_2 from "../../../images/summary_2.svg";
import summary_3 from "../../../images/summary_3.svg";
import summary_4 from "../../../images/summary_4.svg";
import summary_9 from "../../../images/summary_9.png";
import Utility from "../../../redux/actions/Utility";
import AppInContentHeader from "../../AppContent/AppInContentHeader";
import OverlayContext from "../../AppContent/AppOverlayContext";
import DnsTable from "./DnsTable";
import { IPSummary4 } from "./IPSummary4";
import { IPSummary6 } from "./IPSummary6";
import Styled from "./MaterialComponents/DnsIndex.style";
import { TacMode } from "./TacMode";
import Prompt from "src/components/DeletePrompt/Prompt";

export const DnsContext = createContext();

const DnsManagement = () => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);

  const [state, setState] = useState();
  const [networkData, setNetworkData] = useState([]);
  const [load, setLoad] = useState(true);
  const [gatewayAddress, setGatewayAddress] = useState(null);

  const [prompt, setPrompt] = useState(false);
  const [message, setMessage] = useState("");

  const value = [state, setState];

  const FQDN = `${
    AppOverlayContext.gatewayList.filter((gateway) => {
      return gateway.address === AppOverlayContext.selectedGateway.address;
    })[0]?.fqdn ?? ""
  }`;

  const markAsLoading = () => {
    setLoad(true);
  };

  const networkdataMap = {
    server: {
      name: "server",
      img: summary_11,
      tooltip: t("page.configure.dnsTacMode.ipSummaryWidget.tooltips.hostname"),
    },
    fqdn: {
      name: "fqdn",
      img: summary_4,
      tooltip: t("page.configure.dnsTacMode.ipSummaryWidget.tooltips.fqdn"),
    },
    ipv4_address: {
      name: "ipv4_address",
      img: summary_2,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.ipAddress",
        { version: 4 },
      ),
    },
    ipv4_prefix: {
      name: "ipv4_prefix",
      img: summary_9,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.ipPrefix",
        { version: 4 },
      ),
    },

    ipv4_gateway: {
      name: "default_gateway",
      img: summary_10,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.defaultGateway",
      ),
    },
  };

  const networkdataMapTwo = {
    server: {
      name: "server",
      img: summary_11,
      tooltip: t("page.configure.dnsTacMode.ipSummaryWidget.tooltips.hostname"),
    },
    fqdn: {
      name: "fqdn",
      img: summary_4,
      tooltip: t("page.configure.dnsTacMode.ipSummaryWidget.tooltips.fqdn"),
    },
    ipv6_address: {
      name: "ipv6_address",
      img: summary_3,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.ipAddress",
        { version: 6 },
      ),
    },
    ipv6_prefix: {
      name: "ipv6_prefix",
      img: summary_9,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.ipPrefix",
        { version: 6 },
      ),
    },

    ipv6_gateway: {
      name: "default_gateway",
      img: summary_10,
      tooltip: t(
        "page.configure.dnsTacMode.ipSummaryWidget.tooltips.defaultGateway",
      ),
    },
  };

  const networkOnCompleteHandler = (response) => {
    let data = {};
    if (response.state === "NETWORK_SUCESS" && response.data !== "") {
      data = response.data;
      data.server = AppOverlayContext.selectedGateway.name;
      data.fqdn = FQDN;
    } else {
      setPrompt(true);
      setMessage(
        `${t("page.configure.dnsTacMode.error.fetchError.0")}\n- ` +
          Utility.getErrorsFromResponse(response, true).join("\n- "),
      );
    }
    AppConfig.setTacMode(data.mode ?? "");
    setNetworkData(data);
    setLoad(false);
  };

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }
    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      markAsLoading();
      setGatewayAddress(null);
      return;
    }
    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;
    if (currentGatewayAddress !== gatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (typeof gatewayAddress === "string") {
      callAPI({
        path: "network",
        params: {
          gatewayIP: AppOverlayContext.selectedGateway.address,
        },
        data: {},
        responder: networkAPIResponder,
        onComplete: networkOnCompleteHandler,
      });
    }
  }, [gatewayAddress]);

  return (
    <>
      <DnsContext.Provider value={value}>
        <Styled.HeaderWrapper>
          <AppInContentHeader
            title={AppConfig.pages.dns.title}
            breadcrumb={AppConfig.pages.dns.breadcrumb}
          />
        </Styled.HeaderWrapper>

        <Styled.Wrapper>
          <Styled.SummaryWrapper>
            <ResponsiveStyled>
              <IPSummary4
                load={load}
                networkData={networkData}
                networkdataMap={networkdataMap}
              />

              <IPSummary6
                load={load}
                networkData={networkData}
                networkdataMapTwo={networkdataMapTwo}
              />
            </ResponsiveStyled>

            <TacMode load={load} networkData={networkData} />
          </Styled.SummaryWrapper>

          <DnsTable />
        </Styled.Wrapper>
      </DnsContext.Provider>
      <Prompt
        open={prompt}
        setOpen={setPrompt}
        contentTitle={t("commons.errorText")}
        contentText={message}
        contentInfo={``}
        agreeTitle={t("commons.okayText")}
        handleAgree={() => setPrompt(false)}
      />
    </>
  );
};

export default DnsManagement;
const ResponsiveStyled = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 10px;
  }
`;

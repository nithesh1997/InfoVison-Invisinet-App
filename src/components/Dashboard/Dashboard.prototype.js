import TrafficIcon from "@mui/icons-material/Traffic";
import Grid from "@material-ui/core/Grid";
import React, { useContext, useEffect, useState } from "react";
import { withCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import callAPI from "../../apis/callAPI";
import { gatewayServiesApiResponder } from "../../apis/responders/gatewayServiesApiResponder.js";
import { IdentitiesAPIResponder } from "../../apis/responders/identities-api-responder";
import { RulesAPIResponder } from "../../apis/responders/rules-api-responder";
import { SummaryAPIResponder } from "../../apis/responders/summary-api-responder";
import { TokensAPIResponder } from "../../apis/responders/tokens-api-responder";
import Config from "../../Config";
import identities_1 from "../../images/identities_1.png";
import identities_2 from "../../images/identities_2.png";
import identities_3 from "../../images/identities_3.png";
import rules_1 from "../../images/rules_1.png";
import rules_2 from "../../images/rules_2.png";
import summary_1 from "../../images/summary_1.png";
import summary_10 from "../../images/summary_10.png";
import summary_2 from "../../images/summary_2.png";
import summary_3 from "../../images/summary_3.png";
import summary_4 from "../../images/summary_4.png";
import summary_5 from "../../images/summary_5.png";
import summary_6 from "../../images/summary_6.png";
import summary_7 from "../../images/summary_7.png";
import token_1 from "../../images/tokens_1.png";
import token_2 from "../../images/tokens_2.png";
import token_3 from "../../images/tokens_3.png";
import token_4 from "../../images/tokens_4.png";
import Portal from "../../Portal";
import { usePortalState } from "../../Portal/hooks/usePortalState";
import AppInContentHeader from "../AppContent/AppInContentHeader";
import OverlayContext from "../AppContent/AppOverlayContext";
import StatsContainerWidgetViewMoreModal from "./StatsContainerWidgetViewMoreModal";
import SelfContainedErrorBoundary from "../ErrorBoundaries/SelfContainedErrorBoundary";
import WidthFillerSkeleton from "../General/WidthFillerSkeleton";
import IdentitiesListDashboard from "./IdentitiesListDashboard";
import Styled from "./MaterialComponents/Dashboard.style";
import RulesListDashboard from "./RulesListDashboard";
import ServicesConfigDashboard from "./ServicesConfigDashboard";
import SummaryListDashboard from "./SummaryListDashboard";
import TokensListDashboard from "./TokensListDashboard";
import TrustLevelsGraphDashboard from "./TrustLevelsGraphDashboard";
import WidgetCard from "./WidgetCard";
import * as common from "../../common";
import { useTranslation } from "react-i18next";

const generateTrustLevelGraphData = (identitiesData, ruleData) => {
  let trustLevelData = [];
  let identityGroup = {};
  let ruleGroup = {};

  identityGroup = Object.values(
    identitiesData.reduce((r, a) => {
      r[a.trust_level] = r[a.trust_level] || {
        trustLevel: a.trust_level,
        count: 0,
      };
      r[a.trust_level].count++;
      return r;
    }, {}),
  );

  ruleGroup = Object.values(
    ruleData.reduce((r, a) => {
      r[a.trustLevel] = r[a.trustLevel] || {
        trustLevel: a.trustLevel,
        rulecount: 0,
      };
      r[a.trustLevel].rulecount++;
      return r;
    }, {}),
  );

  const trustIds = [
    ...new Set([
      ...identityGroup?.map((i) => i?.trustLevel),
      ...ruleGroup?.map((i) => i?.trustLevel),
    ]),
  ];
  trustIds.sort();

  trustLevelData = trustIds?.map((i) => ({
    rulecount: 0,
    count: 0,
    ...identityGroup?.find((f) => f?.trustLevel === i),
    ...ruleGroup?.find((f) => f?.trustLevel === i),
  }));

  const graphData = {
    labels: trustLevelData.map((val) => {
      return "Level " + val.trustLevel;
    }),
    datasets: [
      {
        label: "Sum of Identities",
        data: trustLevelData.map((val) => {
          return val.count;
        }),
        fill: false,
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#F5B31F",
            borderColor: "#F5B31F",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#F5B31F",
          },
        },
      },
      {
        label: "Sum of Rules",
        data: trustLevelData.map((val) => {
          return val.rulecount;
        }),
        elements: {
          line: {
            borderWidth: 1,
            backgroundColor: "#8E5ED5",
            borderColor: "#8E5ED5",
          },
          point: {
            radius: 6,
            hoverRadius: 4,
            backgroundColor: "rgba( 255, 255, 255, 1 )",
            borderColor: "#8E5ED5",
          },
        },
      },
    ],
  };

  return graphData;
};

const Dashboard = (props) => {
  const AppConfig = useContext(Config);
  const AppOverlayContext = useContext(OverlayContext);
  const { gatewayConfig, activeGateway } = useSelector((state) => state);

  const { t, i18n } = useTranslation();

  let [loading, setLoading] = useState(true);
  let [identitiesData, setIdentitiesData] = useState(null);
  let [identitiesLoading, setIdentitiesLoading] = useState(true);
  let [identityData, setIdentityData] = useState([]);
  let [identityDataMap, setIdentityDataMap] = useState({});
  let [progress, setProgress] = useState(0);
  let [ruleData, setRuleData] = useState(null);
  let [rulesData, setRulesData] = useState([]);
  let [rulesLoading, setRulesLoading] = useState(true);
  let [serviceData, setServiceData] = useState(null);
  let [servicesData, setServicesData] = useState([]);
  let [servicesLoading, setServicesLoading] = useState(true);
  let [summaryData, setSummaryData] = useState([]);
  let [summaryLoading, setSummaryLoading] = useState(true);
  let [tokenDataMap, setTokenDataMap] = useState({});
  let [tokenData, setTokenData] = useState([]);
  let [tokensLoading, setTokensLoading] = useState(true);
  let [trustLevelLoading, setTrustLevelLoading] = useState(true);
  let [trustLevelsData, setTrustLevelsData] = useState({});
  let [serviceDataGate, setServiceDataGate] = useState(null);
  let [gatewayServices, setGatewayServices] = useState([]);

  const [isTrusted, setIsTrusted] = useState(true);
  const [runEffect, setRunEffect] = useState("serviceData");
  const [trustedData, setTrustedData] = useState([]);
  const [unTrustedData, setUnTrustedData] = useState([]);
  const [toggling, setToggling] = useState("");
  const [logspin, setLogSpin] = useState(true);
  const [serviceToggle, setServiceToggle] = useState("bump0");
  const [gatewayServicesLoading, setGatewayServicesLoading] = useState(false);

  const [gatewayAddress, setGatewayAddress] = useState(null);
  const [portalState, setPortalState] = usePortalState();

  const [errorStatistics, setErrorStatistics] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  const [errorIdentities, setErrorIdentities] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  const [errorSummary, setErrorSummary] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  const [errorRules, setErrorRules] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  const [errorService, setErrorService] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  const [errorTrustLevel, setErrorTrustLevel] = useState({
    errorHeading: "Widget Error",
    errorMessage:
      "Error loading the widget data. Please try again or refresh the page.",
    forceError: false,
  });

  var items = {};

  const openModal = () => {
    setPortalState((prev) => {
      return {
        ...prev,
        isPortal: true,
      };
    });
  };
  const genKey = () => Math.random().toString(16).slice(2);

  const [portalKey, setPortalKey] = useState(() => genKey());

  const handleClosePortal = () => {
    setPortalKey(genKey());
    setPortalState((prev) => {
      return {
        ...prev,
        isPortal: false,
      };
    });
  };

  const closeModel = () => {
    setPortalKey(genKey());
    setPortalState((prev) => {
      return {
        ...prev,
        isPortal: false,
      };
    });
  };

  const [options, setOptions] = useState({
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 6,
          color: "#000",
          font: {
            weight: 400,
            size: 12,
          },
          align: "end",
        },
        grid: {
          color: "#CCC",
        },
      },
      x: {
        ticks: {
          color: "#000",
          font: {
            weight: 400,
            size: 12,
          },
          align: "center",
        },
        grid: {
          color: "#CCC",
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          boxWidth: 6,
          boxHeight: 6,
          color: "#000",
          padding: 20,
          font: {
            weight: 400,
            size: 12,
          },
        },
      },
    },
  });

  const showData = () => {
    if (window.sessionStorage.getItem("ba-selected-gateway") === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      showData();
    }, AppConfig.dashboard.showContentDelay);

    setProgress(80);
  }, []);

  const identiesdataMap = {
    test: {
      //name: "Test",
      img: identities_1,
    },
    engg: {
      //name: "Engineer",
      img: identities_2,
    },
    support: {
      //name: "Support",
      img: identities_3,
    },
    arch: {
      //name: "Architect",
      img: identities_2,
    },
    mng: {
      //name: "Manager",
      img: identities_2,
    },
    svs: {
      //name: "Supervisor",
      img: identities_3,
    },
    ast_adm: {
      //name: "Assistant Administrators",
      img: identities_1,
    },
    def: {
      name: "default",
      img: identities_1,
    },
  };

  const rulesDataMap = {
    Forward: {
      name: "Forward",
      img: rules_1,
    },
    Drop: {
      name: "Drop",
      img: rules_2,
    },
    def: {
      name: "Default",
      img: rules_1,
    },
  };

  const tokensOrderedList = {
    "Token Insert": {
      name: "Tokens Inserted",
      img: token_1,
    },
    "Token Collision": {
      name: "Token Collisions",
      img: token_2,
    },
    "Token Not Found": {
      name: "Tokens Not Found",
      img: token_3,
    },
    "TCP Pkt In": {
      name: "TCP Packets In",
      img: token_4,
    },
    /* tcpout: {
      name: "TCP Packets Out",
      img: token_2,
    }, */
    def: {
      name: "default",
      img: token_1,
    },
  };
  const tokenImages = [token_1, token_2, token_3, token_4];

  const summaryDataMap = {
    server: {
      // Don't know what this is
      name: "server", // To be later updated and used for tooltips
      img: summary_1,
      tooltip: "Hostname",
    },
    ipv4: {
      name: "ipv4", // To be later updated and used for tooltips
      img: summary_2,
      tooltip: "IPv4",
    },
    ipv6: {
      name: "ipv6", // To be later updated and used for tooltips
      img: summary_3,
      tooltip: "IPv6",
    },
    fqdn: {
      name: "fqdn", // To be later updated and used for tooltips
      img: summary_4,
      tooltip: "FQDN",
    },
    version: {
      name: "version", // To be later updated and used for tooltips
      img: summary_5,
      tooltip: "Version",
    },
    firmwareVersion: {
      name: "firmwareVersion", // To be later updated and used for tooltips
      img: summary_10,
      tooltip: `${common.GATEWAY} Firmware Version`,
    },
    uptime: {
      name: "uptime", // To be later updated and used for tooltips
      img: summary_6,
      tooltip: "Uptime",
    },
    gwcertexpiryUTC: {
      name: "gwcertexpiryUTC", // To be later updated and used for tooltips
      img: summary_7,
      tooltip: `${common.GATEWAY} certificate expiry date`,
    },
    traffic_allowed: {
      name: "traffic_allowed",
      img: TrafficIcon,
      tooltip: "Traffic allowed on this gateway",
    },
  };

  const mappedData = {
    distributed: {
      name: "Distributed Identities",
    },
    PubSub: {
      name: "PubSub",
    },
    restapi: {
      name: "RestApi",
    },
    RemoteSyslog: {
      name: "Remote Syslog",
    },
    ntp: {
      name: "NTP",
    },
    ssh: {
      name: "SSHD",
    },
  };

  const servicesDataMap =
    gatewayConfig.chassis_model === "5010" || serviceToggle === "mgt"
      ? mappedData
      : { ...mappedData, rkagent: { name: "Remote Keying" } };
  const markAsLoading = () => {
    setLoading(true);
    setIdentitiesLoading(true);
    setRulesLoading(true);
    setServicesLoading(true);
    setSummaryLoading(true);
    setTokensLoading(true);
    setTrustLevelLoading(true);
    setErrorStatistics((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
    setErrorIdentities((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
    setErrorRules((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
    setErrorSummary((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
    setErrorService((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
    setErrorTrustLevel((prev) => {
      return {
        ...prev,
        forceError: false,
      };
    });
  };

  useEffect(() => {
    if (
      typeof AppOverlayContext.selectedGateway !== "object" ||
      AppOverlayContext.selectedGateway === null
    ) {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    if (typeof AppOverlayContext.selectedGateway.address !== "string") {
      setGatewayAddress(null);
      markAsLoading();
      return;
    }

    const currentGatewayAddress = AppOverlayContext.selectedGateway.address;

    if (gatewayAddress !== currentGatewayAddress) {
      setGatewayAddress(currentGatewayAddress);
      markAsLoading();
    }
  }, [AppOverlayContext.selectedGateway]);

  useEffect(() => {
    if (
      typeof gatewayAddress === "string" &&
      loading === true &&
      identitiesLoading === true &&
      rulesLoading === true &&
      servicesLoading === true &&
      summaryLoading === true &&
      tokensLoading === true &&
      trustLevelLoading === true
    ) {
      callAPI({
        path: "getIdentitiesv2",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: IdentitiesAPIResponder,
        onComplete: IdentitiesOnCompleteHandler,
      });

      callAPI({
        path: "rules",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: RulesAPIResponder,
        onComplete: RulesOnCompleteHandler,
      });

      callAPI({
        path: "tokens",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: TokensAPIResponder,
        onComplete: TokensOnCompleteHandler,
      });

      callAPI({
        path: "summary",
        params: {
          gatewayIP: gatewayAddress,
        },
        data: {},
        responder: SummaryAPIResponder,
        onComplete: DSSummaryOnCompleteHandler,
      });
    }
  }, [
    gatewayAddress,
    loading,
    identitiesLoading,
    rulesLoading,
    servicesLoading,
    summaryLoading,
    tokensLoading,
    trustLevelLoading,
  ]);

  useEffect(() => {
    if (
      identitiesLoading === false &&
      rulesLoading === false &&
      servicesLoading === false &&
      summaryLoading === false &&
      tokensLoading === false &&
      trustLevelLoading === false
    ) {
      setLoading(false);
    }
  }, [
    identitiesLoading,
    rulesLoading,
    servicesLoading,
    summaryLoading,
    tokensLoading,
    trustLevelLoading,
  ]);

  const onCompleteGatewayServies = (response) => {
    if (response.state === "GATEWAY_SERVICES_API_SUCCESS") {
      setServiceDataGate(response.data);
      setServicesData(response.data);
    } else {
      setServiceToggle((oldState) => (oldState === "bump0" ? "mgt" : "bump0"));
    }

    setTimeout(() => {
      setGatewayServicesLoading(false);
    }, 500);
  };

  const IdentitiesOnCompleteHandler = (response) => {
    let data = [];
    const alloweds = [0, 1, 2, 3, 4, 5, 6, 7];

    if (response.state === "IDENTITIES_SUCESS" && response.data !== "") {
      data = response.data.filter(({ trust_level }) =>
        alloweds.includes(trust_level),
      );

      setIdentitiesData(data);
      let group = Object.values(
        data.reduce((r, a) => {
          r[a.group] = r[a.group] || { name: a.group, count: 0, groupid: a.id };
          r[a.group].count++;
          return r;
        }, {}),
      );
      group.sort();
      const identityNames = [...group?.map((i) => i?.name)];
      const img = [identities_1, identities_2, identities_3];

      var count = 0;

      identityNames.sort().forEach((item) => {
        items[identityNames[count]] = {
          name: identityNames[count],
          img: img[count % img.length],
        };
        count += 1;
      });

      group.sort((a, b) => {
        let nameA = a.name.toLowerCase();
        let nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

      setTimeout(() => {
        setIdentityData(group);
        setIdentityDataMap(items);
        setIdentitiesLoading(false);
      }, AppConfig.dashboard.showWidgetContentDelay);
    } else {
      setErrorIdentities((prev) => {
        return {
          ...prev,
          forceError: true,
        };
      });
      setErrorTrustLevel((prev) => {
        return {
          ...prev,
          forceError: true,
        };
      });
    }
  };

  const RulesOnCompleteHandler = (response) => {
    let data = [];
    let group = {};

    if (response.state === "RULES_SUCESS" && response.data !== "") {
      data = response.data;
      setRuleData(data);
      group = Object.values(
        data.reduce((r, a) => {
          r[a.action] = r[a.action] || {
            name: a.action,
            rulecount: 0,
            count: 0,
            actionid: a.id,
          };
          r[a.action].rulecount++;
          r[a.action].count++;
          return r;
        }, {}),
      );
    } else {
      setErrorRules((prev) => {
        return {
          ...prev,
          forceError: true,
        };
      });
      setErrorTrustLevel((prev) => {
        return {
          ...prev,
          forceError: true,
        };
      });
    }

    setTimeout(() => {
      setRulesData(group);
      setRulesLoading(false);
    }, AppConfig.dashboard.showWidgetContentDelay);
  };

  const TokensOnCompleteHandler = (response) => {
    let data = [];
    let items = [];
    let trustedItems = [];
    let unTrustedItems = [];
    let itemsMap = {};

    if (response.state === "TOKENS_SUCESS" && response.data !== "") {
      data = response.data;

      if (data.rows !== undefined) {
        data = data.rows;
      } else {
        data = [];
      }

      let itemCount = 0;

      // Sweep for items that are not objects or have no name key
      data = data.filter((item) => {
        if (typeof item !== "object") {
          return false;
        }

        if (typeof item.name !== "string") {
          return false;
        }
        return true;
      });

      // Find and process priority items from defined map
      let orderedItems = Object.keys(tokensOrderedList);
      orderedItems.forEach((itemName) => {
        let count = 0;
        for (count = 0; count < data.length; count += 1) {
          if (data[count].name === itemName) {
            items.push({
              name: tokensOrderedList[itemName].name,
              groupid: itemCount,
              count: data[count].gateway_t,
            });
            itemsMap[tokensOrderedList[itemName].name] = {
              name: tokensOrderedList[itemName].name,
              img: tokensOrderedList[itemName].img,
            };
            itemCount += 1;
            // data.splice(count, 1);
            return;
          }
        }
      });

      data.forEach((item) => {
        items.push({
          name: item.name,
          groupid: itemCount,
          count: item.gateway_t,
        });

        trustedItems.push({
          name: item.name,
          groupid: itemCount,
          count: item.gateway_t,
        });

        unTrustedItems.push({
          name: item.name,
          groupid: itemCount,
          count: item.gateway_u,
        });

        itemsMap[item.name] = {
          name: item.name,
          img: tokenImages[itemCount % tokenImages.length],
        };

        itemCount += 1;
      });

      setTokenData(items);
      setTrustedData(trustedItems);
      setUnTrustedData(unTrustedItems);
      setTokenDataMap(itemsMap);
      setTokensLoading(false);
    } else {
      setErrorStatistics((prev) => {
        return { ...prev, forceError: true };
      });
    }
  };

  const DSSummaryOnCompleteHandler = (response) => {
    let data = [];

    if (response.state === "SUMMARY_SUCESS" && response.data !== "") {
      data = response.data;

      setServiceData(data);
    } else {
      setErrorSummary((prev) => {
        return { ...prev, forceError: true };
      });

      setErrorService((prev) => {
        return { ...prev, forceError: true };
      });
    }

    if (data != null && data.uptime !== undefined) {
      let uptime = data.uptime;
      let days = Math.floor(uptime / 3600 / 24);
      if (days > 0) {
        data.uptime = days > 1 ? days + " days, " : days + " day, ";
        uptime = uptime % (3600 * 24);
      } else data.uptime = "";
      let hrs = Math.floor(uptime / 3600);
      data.uptime += hrs > 1 ? hrs + " hrs, " : hrs + " hr, ";
      uptime = uptime % 3600;
      data.uptime += Math.floor(uptime / 60) + " min, ";
      uptime = uptime % 60;
      data.uptime += uptime + " sec";
    }

    setTimeout(() => {
      setSummaryData(data);
      setSummaryLoading(false);
    }, AppConfig.dashboard.showWidgetContentDelay);
  };

  useEffect(() => {
    let data = [];
    let res;
    let res2;

    if (serviceData !== null && serviceDataGate !== null) {
      data = serviceData;

      // let responseIAS = serviceDataGate.find(
      //   ({ ui_name }) => ui_name === "IAS"
      // );

      let responseRkagent = serviceDataGate.find(
        ({ ui_name }) => ui_name === "rkagent",
      );
      let responseSyslog = serviceDataGate.find(
        ({ ui_name }) => ui_name === "RemoteSyslog",
      );
      let responseNtp = serviceDataGate.find(
        ({ ui_name }) => ui_name === "ntp",
      );
      let responseSsh = serviceDataGate.find(
        ({ ui_name }) => ui_name === "ssh",
      );
      let responseDist = serviceDataGate.find(
        ({ ui_name }) => ui_name === "DistIdent",
      );
      let responsePubSub = serviceDataGate.find(
        ({ ui_name }) => ui_name === "PubSub",
      );
      // if (responseIAS !== undefined) {
      //   res = responseIAS.enable === 1 ? true : false;
      //   data.ias = res;
      // }
      let responseRestAPI = serviceDataGate.find(
        ({ ui_name }) => ui_name === "RestAPI",
      );
      if (responseRkagent !== undefined) {
        res2 = responseRkagent.enable === 1 ? true : false;
        data.rkagent = res2;
      }
      if (responseSyslog !== undefined) {
        res2 = responseSyslog.enable === 1 ? true : false;
        data.RemoteSyslog = res2;
      }
      if (responseNtp !== undefined) {
        res2 = responseNtp.enable === 1 ? true : false;
        data.ntp = res2;
      }
      if (responseSsh !== undefined) {
        res2 = responseSsh.enable === 1 ? true : false;
        data.ssh = res2;
      }
      if (responseRestAPI !== undefined) {
        res2 = responseRestAPI.enable;
        data.restapi = res2;
      }

      if (responseDist !== undefined) {
        res2 = responseDist.enable === 1 ? true : false;
        data.distributed = res2;
      }
      if (responsePubSub !== undefined) {
        res2 = responsePubSub.enable === 1 ? true : false;
        data.PubSub = res2;
      }

      let ctx = serviceDataGate.find(({ ctx_name }) => ctx_name);

      setTimeout(() => {
        setServicesData(data);
        setServiceToggle(ctx.ctx_name);
        setServicesLoading(false);
      }, AppConfig.dashboard.showWidgetContentDelay);
    }
  }, [serviceData, serviceDataGate]);

  useEffect(() => {
    if (identitiesData !== null && ruleData !== null) {
      const graphData = generateTrustLevelGraphData(identitiesData, ruleData);

      setTimeout(() => {
        setTrustLevelsData(graphData);
        setTrustLevelLoading(false);
      }, AppConfig.dashboard.showWidgetContentDelay);
    }
  }, [identitiesData, ruleData]);

  const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue,
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, {}); // empty object is the initial value for result object
  };

  /* Toggle Trusted & Untrusted counts */
  useEffect(() => {
    if (runEffect === "toggleData" && gatewayConfig.chassis_model !== 5010) {
      setIsTrusted((oldState) => !oldState);

      setTimeout(() => {
        setToggling("");
      }, 300);
    }

    setRunEffect("");
  }, [runEffect]);

  /* Toggle bump & mgt */ // use effect call api
  useEffect(() => {
    if (runEffect === "serviceData" && !!activeGateway.address) {
      setLogSpin((oldState) => !oldState);

      callAPI({
        path: "gatewayServies",
        params: { gatewayIP: activeGateway.address, context: serviceToggle },
        data: {},
        responder: gatewayServiesApiResponder,
        onComplete: onCompleteGatewayServies,
      });
    }

    setRunEffect("");
  }, [activeGateway, runEffect, serviceToggle]);

  useEffect(() => {
    if (gatewayConfig.chassis_model === "5010") {
      setIsTrusted(false);
    }
  }, [gatewayConfig.chassis_model]);

  return (
    <>
      <Styled.Container component={"section"} /* onClick={showData} */>
        <AppInContentHeader
          title={AppConfig.pages.dsh.title}
          breadcrumb={AppConfig.pages.dsh.breadcrumb}
        />

        <Styled.WidgetContainer container xs={12} spacing={3}>
          <Grid item xs={5}>
            {loading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorStatistics.errorHeading}
                errorMessage={errorStatistics.errorMessage}
                forceError={errorStatistics.forceError}
              >
                {/* <WidgetCard
                  content={
                    <TokensListDashboard
                      tokensDataMap={tokenDataMap}
                      tokenData={isTrusted ? trustedData : unTrustedData}
                      loading={toggling === "loading" || tokensLoading}
                      statsData={{ trustedData, unTrustedData }}
                      openModal={openModal}
                      isTrusted={isTrusted}
                    />
                  }
                  title={"Statistics"}
                  toggleName={isTrusted ? "Trusted" : "Untrusted"}
                  toggleHandler={() => {
                    setRunEffect("toggleData");
                    //setToggling("loading");
                  }}
                  url={"#"}
                  info={<>Count of Application Traffic Logs</>}
                /> */}
                <WidgetCard
                  title={"Statistics"}
                  content={
                    <TokensListDashboard
                      tokensDataMap={tokenDataMap}
                      tokenData={isTrusted ? trustedData : unTrustedData}
                      loading={toggling === "loading" || tokensLoading}
                      statsData={{ trustedData, unTrustedData }}
                      openModal={openModal}
                      isTrusted={isTrusted}
                    />
                  }
                  toggleHandler={() => {
                    setRunEffect("toggleData");
                    //setToggling("loading");
                  }}
                  toggleShow={gatewayConfig.chassis_model}
                  toggleName={isTrusted ? "Trusted" : "Untrusted"}
                  url={"#"}
                  info={<>Count of Application Traffic Logs</>}
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>

          <Grid item xs={4}>
            {loading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorIdentities.errorHeading}
                errorMessage={errorIdentities.errorMessage}
                forceError={errorIdentities.forceError}
              >
                <WidgetCard
                  content={
                    <IdentitiesListDashboard
                      identiesDataMap={identityDataMap}
                      identityData={identityData}
                      loading={identitiesLoading}
                      openModal={openModal}
                    />
                  }
                  title={"Identities"}
                  url={AppConfig.root.concat(AppConfig.pages.idm.path)}
                  info={<>Shows the number of identities in each group.</>}
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>

          <Grid item xs={3}>
            {loading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorSummary.errorHeading}
                errorMessage={errorSummary.errorMessage}
                forceError={errorSummary.forceError}
              >
                <WidgetCard
                  content={
                    <SummaryListDashboard
                      summaryDataMap={summaryDataMap}
                      summaryData={summaryData}
                      loading={summaryLoading}
                    />
                  }
                  title={t("page.home.summary.title")}
                  url={"#"}
                  info={t("page.home.summary.tooltip")}
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>

          <Grid item xs={5}>
            {loading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorTrustLevel.errorHeading}
                errorMessage={errorTrustLevel.errorMessage}
                forceError={errorTrustLevel.forceError}
              >
                <WidgetCard
                  content={
                    <TrustLevelsGraphDashboard
                      options={options}
                      trustLevelsData={trustLevelsData}
                      loading={trustLevelLoading}
                    />
                  }
                  title={"Trust Levels"}
                  url={AppConfig.root.concat(AppConfig.pages.trl.path)}
                  info={<>Trust Level vs Identities and Rules configured.</>}
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>

          <Grid item xs={4}>
            {loading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorRules.errorHeading}
                errorMessage={errorRules.errorMessage}
                forceError={errorRules.forceError}
              >
                <WidgetCard
                  content={
                    <RulesListDashboard
                      rulesDataMap={rulesDataMap}
                      rulesData={rulesData}
                      loading={rulesLoading}
                    />
                  }
                  title={"Rules"}
                  url={AppConfig.root.concat(AppConfig.pages.rum.path)}
                  info={<>Shows the number of rules categorized by action.</>}
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>

          <Grid item xs={3}>
            {loading || gatewayServicesLoading ? (
              <WidthFillerSkeleton />
            ) : (
              <SelfContainedErrorBoundary
                errorHeading={errorService.errorHeading}
                errorMessage={errorService.errorMessage}
                forceError={errorService.forceError}
              >
                <WidgetCard
                  content={
                    <ServicesConfigDashboard
                      servicesDataMap={servicesDataMap}
                      servicesData={servicesData}
                      loading={servicesLoading}
                    />
                  }
                  title={"Services"}
                  toggleName={serviceToggle}
                  toggleHandler={() => {
                    setServiceToggle((oldState) =>
                      oldState === "bump0" ? "mgt" : "bump0",
                    );

                    setRunEffect("serviceData");
                    setGatewayServicesLoading(true);
                    //setToggling("loading");
                  }}
                  url={"#"}
                  info={
                    <>
                      Current status of the services
                      <br />
                      running in the selected gateway.
                    </>
                  }
                />
              </SelfContainedErrorBoundary>
            )}
          </Grid>
        </Styled.WidgetContainer>
      </Styled.Container>
    </>
  );
};

export default withRouter(withCookies(Dashboard));

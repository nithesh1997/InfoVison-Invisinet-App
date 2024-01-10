import { createContext, useState } from "react";
import version from "./Version.js";
import { AppName } from "./utils/ProjectName/Index.js";

const breakpoints = {
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
};

const ConfigData = {
  version,
  root: `/${AppName.toLowerCase()}`,
  themes: {
    dark: {
      __mui: {
        breakpoints: breakpoints,
        palette: {
          type: "dark",
        },
      },
    },
    light: {
      __default: {
        pageLoader: {
          bg: "#FFFFFF",
        },
        pageLoaderSpinner: {
          color: "#0094FD",
        },
        pageLoaderCaption: {
          color: "#121212",
        },
        skeleton: {
          bg: "#F1F1F1",
        },
        appContent: {
          bg: "#FFFFFF",
        },
        appHeader: {
          bg: "#FFFFFF",
          boxShadow: "#EFEFEF",
        },
        appHamburger: {
          hoverBg: "#D6EEFF",
          // hoverBg: "#EBF6FF"
        },
        appMenu: {
          bg: "#203865",
        },
        appMenuIcon: {
          bg: "transparent",
          hoverBg: "rgba( 255, 255, 255, 0.25)",
          color: "#0094FD",
          hoverColor: "#FFFFFF",
        },
        appMenuItem: {
          hoverBg: "#0D6EFD",
          selectedBg: "#0094FD",
          expandedBg: "#005FA3",
          color: "#FFFFFF",
        },
        appMenuItemExpand: {
          color: "#FFFFFF",
        },
        dashboardWidgetCard: {
          bg: "#FFFFFF",
          boxShadow: "rgba( 0, 0, 0, 0.1 )",
        },
        dashboardWidgetHeading: {
          color: "#000000",
        },
        dashboardWidgetIcon: {
          hoverBg: "#D6EEFF",
          // hoverBg: "#EBF6FF"
        },
        dashboardStatWidgetItem: {
          borderColor: "#E7F3FF",
          color: "#212529",
        },
        dashboardStatWidgetNavigationIcon: {
          color: "#0094FD",
          hoverBg: "#EBF7FF",
        },
        dashboardStatWidgetNavigationInfo: {
          color: "#203865",
        },
        dashboardStatWidgetViewMore: {
          color: "#FFFFFF",
          bg: "#018FF6",
          hoverBg: "#0B5ED7",
        },
      },
      __mui: {
        breakpoints: breakpoints,
        palette: {
          type: "light",
        },
      },
    },
  },
  loader: {
    hideDelay: 500,
  },
  app: {
    signOutDelay: 500, // required for user to see sign out button click effect
    headerMain: {
      menu: {
        textBanner: {
          width: 192.5, // px
          height: 39, // px
          collapseDelay: 100, // ms
        },
      },
    },
    sideMenu: {
      collapseDelay: 200, // ms
      subMenu: {
        collapseDelay: 200, // ms
      },
    },
  },
  dashboard: {
    showContentDelay: 500,
    showWidgetContentDelay: 500,
    statWidget: {
      pageTransitionDelay: 350,
    },
  },
  identityManagement: {
    showContentDelay: 500,
  },
  pages: {
    // keys are same as menu codes
    sgn: {
      path: "/sign-in",
    },
    dsh: {
      path: "/home/dashboard",
      title: "Dashboard",
      breadcrumb: "Home > Dashboard",
    },
    idm: {
      path: "/manage/identities",
      title: "Identities",
      breadcrumb: "Manage > Identities",
    },
    prs: {
      path: "/manage/protected-resources",
      title: "Protected Resources",
      breadcrumb: "Manage > Protected Resources",
    },
    rsl: {
      path: "/manage/resource-lists",
      title: "Resource Lists",
      breadcrumb: "Manage > Resource Lists",
    },
    urs: {
      path: "/manage/unprotected-resources",
      title: "Unprotected Resources",
      breadcrumb: "Manage > Unprotected Resources",
    },
    rum: {
      path: "/manage/rules",
      title: "Rules",
      breadcrumb: "Manage > Rules",
    },
    trl: {
      path: "/manage/trust-level",
      title: "Trust Level",
      breadcrumb: "Manage > Trust Level",
    },
    dns: {
      path: "/configure/dns-tac-mode",
      title: "DNS / TAC Mode",
      breadcrumb: "Configure > DNS / TAC Mode",
    },
    ly3: {
      path: "/configure/layer3",
      title: "Layer3",
      breadcrumb: "Configure > Layer3",
    },
    apm: {
      path: "/configure/applications",
      title: "Applications",
      breadcrumb: "Configure > Applications",
    },
    set: {
      path: "/configure/settings",
      title: "Settings",
      breadcrumb: "Configure > Settings",
    },
    con: {
      path: "/configure/configuration-logs",
      title: "Configuration Logs",
      breadcrumb: "Configure > Configuration Logs",
    },
    /* tac: {
      path: "/configurek/tac-mode",
      title: "Page Title",
      breadcrumb: "Page Breadcrumb",
    }, */
    /* rem: {
      path: "/configure/rules-management",
      title: "Page Title",
      breadcrumb: "Page Breadcrumb",
    }, */
    tum: {
      path: "/gateway/services",
      title: "Services",
      breadcrumb: "Gateway/Server > Services",
    },
    flr: {
      path: "/gateway/filter-rules",
      title: "Filter Rules",
      breadcrumb: "Gateway > Filter Rules",
    },
    /* gwm: {
      path: "/gateway/gateway-management",
      title: "Page Title",
      breadcrumb: "Page Breadcrumb",
    }, */
    enp: {
      path: "/endpoint/configure",
      title: "Configure Endpoints",
      breadcrumb: "Endpoint > Configure",
    },
    mfw: {
      path: "/endpoint/manage-firmware",
      title: "Manage Firmware",
      breadcrumb: "Endpoint > Firmware",
    },
    /* tst: {
      path: "/maintenance/troubleshooting",
      title: "Troubleshooting",
      breadcrumb: "Maintain > Troubleshooting",
    }, */
    /* slg: {
      path: "/maintenance/syslog",
      title: "Syslog",
      breadcrumb: "Maintain > Syslog",
    }, */
    rbt: {
      path: "/maintenance/reboot",
      title: "Reboot",
      breadcrumb: "Maintain > Reboot",
    },
    ifvdgdev: {
      path: "/ifvdg-dev",
      title: "IFVDG Development",
      breadcrumb: "Hidden Workspace > IFVDG Development",
    },
    dev: {
      path: "/dev",
      title: "Development",
      breadcrumb: "Developement > Table Development",
    },
    tsk: {
      path: "/endpoint/tasks",
      title: "Endpoint Task Status",
      breadcrumb: "Endpoint > Task Status",
    },
    lgf: {
      path: "/endpoint/logfiles",
      title: "Endpoint Log Files",
      breadcrumb: "Endpoint > Log Files",
    },
  },
};

const Config = createContext();

const ConfigProvider = (props) => {
  let [theme, setTheme] = useState("light");
  let [tacMode, setTacMode] = useState("");

  const ConfigContext = {
    ...ConfigData,
    theme: theme,
    setTheme: (theme) => {
      setTheme(theme);
    },
    tacMode,
    setTacMode,
  };

  return (
    <Config.Provider value={ConfigContext}>{props.children}</Config.Provider>
  );
};

export { ConfigData, ConfigProvider };
export default Config;

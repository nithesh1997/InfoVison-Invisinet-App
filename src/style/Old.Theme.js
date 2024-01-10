// import { createTheme } from "@mui/material/styles";
import "@fontsource/inter";

const breakpoints = {
  keys: ["xs", "sm", "md", "lg", "xl"],
  values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
};

export const getDesignToken = (mode) => ({
  palette: {
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
  typography: {
    fontFamily: "Inter",
    allVariants: {
      fontFamily: "Inter",
    },
    body1: {
      fontFamily: "Inter",
    },
    body2: {
      fontFamily: "Inter",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      fontFamily: "Inter",
    },
    metaData: {
      fontSize: "0.625rem",
    },
    labels: {
      fontSize: "0.688rem",
    },
    bodyText: {
      fontSize: "0.75rem",
    },
    xlNumerics: {
      fontSize: "2.25rem",
    },
    paneHeader: {
      fontSize: "0.875rem",
    },
    specialPaneHeader: {
      fontSize: "1.25rem ",
    },
    pageTitle: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.688rem",
          fontWeight: 400,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          label: {
            fontSize: "0.688rem",
            fontWeight: 400,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.75rem",
          fontWeight: 400,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#DFDFDF",
        },
      },
    },
  },
});

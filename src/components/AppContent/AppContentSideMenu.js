import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import MenuList from "@material-ui/core/MenuList";
import { Person } from "@material-ui/icons";
import React, { useContext, useEffect, useState } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import { withCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppContentSideMenuItem from "./AppContentSideMenuItem";
import AppMenuContext from "./AppMenuContext";
import { ChevronDown } from "react-bootstrap-icons";
import { Typography } from "@material-ui/core";
import { setNavigationMenu } from "../../redux/Slices/navigationMenuSlice";
import { Images } from "../../NamedImages/NamedImages";
import { useTranslation } from "react-i18next";

const StyledMenu = styled(Box)`
  @media (max-width: 320px) {
    display: ${(props) => (props.show ? "none" : "flex")};
    z-index: 1000;
    height: 993px;
    position: absolute;
    top: -13.5%;
    bottom: 1.4%;
    overflow-y: auto;
  }

  @media (min-width: 321px) and (max-width: 640px) {
    display: ${(props) => (props.show ? "none" : "flex")};
    bottom: 13.4%;
    z-index: 1000;
    height: 993px;
    position: absolute;
    top: -13.5%;
  }

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  flex-shrink: 0;
  position: relative;
  height: 100%;
  background-color: ${(props) => props.bg};
  background-image: url(${(props) =>
    !props.collapsed ? props.bgImage : null});
  background-repeat: no-repeat;
  background-position: 70% 105%;

  & *::-webkit-scrollbar {
    width: 0.5vw;
    height: 0.5vw;
  }

  /* Track */
  & *::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 0.5vw;
  }

  & *::-webkit-scrollbar-track:hover {
    background: rgba(255, 255, 255, 0.85);
  }

  /* Handle */
  & *::-webkit-scrollbar-thumb {
    background: #7395d3;
    border-radius: 0.5vw;
  }

  & *::-webkit-scrollbar-thumb:hover {
    background: #4572c4;
  }

  @media (max-width: 320px) {
    display: ${(props) => (props.show ? "none" : "flex")};
    z-index: 1000;
    height: 993px;
    position: absolute;
    top: -13.5%;
    bottom: 1.4%;
  }

  @media (max-width: 640px) {
    display: ${(props) => (props.show ? "none" : "flex")};
    bottom: 13.4%;
    z-index: 1000;
    height: 993px;
    position: absolute;
    top: -13.5%;
  }
`;

const StyledMenuTrigger = styled(IconButton)`
  position: absolute;
  z-index: 10;
  top: 0.35em;
  right: -0.5em;
  width: 1em;
  height: 1em;
  padding: 0.2em;
  background-color: #fff;
  border-radius: 2em;
  box-shadow: 0.1em 0.1em 2em -0em #333;

  @media (max-width: 320px) {
    display: none;
  }

  @media (max-width: 640px) {
    display: none;
  }

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }

  @media (max-width: 320px) {
    display: none;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const StyledMenuList = styled(MenuList)`
  width: 19em;
  transition: width ${(props) => props.collapseDelay / 1000}s ease-out;
  padding: 0em 0em 1.5em 0em;
  overflow: auto;
  max-height: calc(100vh - 4em);

  &.collapsed {
    width: 4.5em;
    transition: width ${(props) => props.collapseDelay / 1000}s ease-in;
  }

  @media (max-width: 320px) {
    width: 15.5em;
  }
  @media (min-width: 321px) and (max-width: 640px) {
    width: 15.5em;
  }

  @media (max-width: 320px) {
    width: 15.5em;
  }

  @media (max-width: 640px) {
    width: 15.5em;
  }
`;

const StyledUser = styled(Box)`
  display: none;

  @media (max-width: 320px) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 80px;
    width: 15.5em;

    justify-content: center;
    align-items: center;
    height: 4.2em;

    & .loginuser {
      width: 35px;
      margin-right: 1rem !important;
      margin-left: 1rem !important;
    }

    & img {
      width: 100%;
      vertical-align: middle;
      border-radius: 50% !important;
    }

    & h5 {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      margin: 0px;
    }

    & .header_user_position {
      color: #a6a6a6;
      font-weight: 600;
      font-size: 12px;
      display: block;
    }
  }
`;

const StyledChevronRight = styled(ChevronRight)`
  transform: rotate(-180deg);
  padding-left: 0.1em;
  transition: transform ${(props) => props.collapseDelay / 1000}s ease-out;

  &.collapsed {
    transform: rotate(0deg);
    transition: transform ${(props) => props.collapseDelay / 1000}s ease-in;
  }
`;

const menuItems = [
  "dsh",
  "idm",
  "prs",
  "rsl",
  "urs",
  "rum",
  "trl",
  "dns",
  "tac",
  "ly3",
  "apm",
  "set",
  "con",
  "tum",
  "flr",
  "enp",
  "mfw",
  "tsk",
  "lgf",
  "rbt",
  // "slg",
  // "mnr",
  "rem",
  "gwm",
  "tst",
];

const genKey = () => Math.random().toString(16).slice(2);
const captailizer = (user) => {
  let Check = user;
  Check = !!!Check ? "unknown" : Check;
  return Check.split(" ")
    .map((_) => _[0].toUpperCase() + _.slice(1, _.length))
    .join(" ");
};

const SideMenu = (props) => {
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const MenuContext = useContext(AppMenuContext);

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const menu = MenuContext.menu;
  const menuNames = Object.keys(menu);
  const generatedMenu = {};
  const generatedMenuRootNames = []; // Only menus that are either at root level or have a submenu are added here.
  let menusDiscarded = [];
  let [generatedMenuElems, setGeneratedMenuElems] = useState([]);
  let [hideMenu, setHideMenu] = useState(false);
  const [menuList, setmenuList] = useState({});
  const [sideMenuKey, setSideMenuKey] = useState(genKey());
  const [runEffect, setRunEffect] = useState("");

  const gatewayConfig = useSelector((state) => state.gatewayConfig);
  let { role } = useSelector((state) => state.userProfile);

  let sessionName = sessionStorage.getItem("sessionName");

  const handleMenuClick = () => {
    if (!MenuContext.collapsed) {
      Object.values(MenuContext.setSubMenuCollapsed).forEach((fn) => {
        fn(true);
      });
    }

    MenuContext.setCollapsed(!MenuContext.collapsed);
    dispatch(setNavigationMenu({ isCollapsed: !MenuContext.collapsed }));
  };

  useEffect(() => {
    // To be fetched via API ( role-based ) later. This should only contain items that have no submenu. The order in which keys are provided matter.
    const allowedMenus = menuItems.filter((menu) => {
      return (
        !Boolean(AppConfig.gatewayVariant === "tac-server" && menu === "ly3") &&
        !Boolean(AppConfig.gatewayVariant === "tac-server" && menu === "urs") &&
        !Boolean(AppConfig.gatewayVariant === "tac-server" && menu === "flr")
      );
    });

    const allowedMenusLen = allowedMenus.length;

    // Generating the menu structure
    for (let count1 = 0; count1 < allowedMenusLen; count1 += 1) {
      let menuName = allowedMenus[count1];
      if (menuNames.indexOf(menuName) === -1) {
        menusDiscarded.push(menuName);
        continue;
      } else {
        let menuItem = menu[menuName];
        let parentName = menuItem.parent;

        if (parentName === undefined) {
          // Root menu
          generatedMenu[menuName] = menuItem;
          generatedMenuRootNames.push(menuName);
          continue;
        }

        let menuTree = [menuName];
        let brokenTree = true;
        while (true) {
          if (menuNames.indexOf(parentName) === -1) {
            break;
          }
          menuTree.push(parentName);
          parentName = menu[parentName].parent;
          if (parentName === undefined) {
            brokenTree = false;
            break;
          }
        }
        if (brokenTree) {
          menusDiscarded.push(menuName);
          continue;
        }

        let menuTreeLen = menuTree.length;
        let menuRef = generatedMenu;
        for (let count1 = menuTreeLen - 1; count1 > 0; count1 -= 1) {
          // Only until the 1st node
          let menuTreeItemName = menuTree[count1];
          if (generatedMenuRootNames.indexOf(menuTreeItemName) === -1) {
            menuRef[menuTreeItemName] = menu[menuTreeItemName];
            generatedMenuRootNames.push(menuTreeItemName);
          }
          menuRef = menuRef[menuTreeItemName];
        }
        menuRef[menuName] = menuItem;
      }
    }

    setmenuList(generatedMenu);

    // Generating the menu
    const generatedMenuNames = Object.keys(generatedMenu);

    setGeneratedMenuElems((oldState) => {
      return generatedMenuNames.map((menuName) => (
        <AppContentSideMenuItem
          menuName={menuName}
          menuItem={generatedMenu[menuName]}
          level={0}
          parentName={undefined}
        />
      ));
    });
  }, []);

  useEffect(() => {
    if (runEffect === "tac-server-re-render") {
      const navMenu = { ...menuList };

      navMenu?.mnw?.ly3 && delete navMenu.mnw.ly3;
      navMenu?.exp?.urs && delete navMenu.exp.urs;
      navMenu?.gws?.flr && delete navMenu.gws.flr;

      setGeneratedMenuElems(
        Object.keys(navMenu).map((menuName) => (
          <AppContentSideMenuItem
            menuName={menuName}
            menuItem={menuList[menuName]}
            level={0}
            parentName={undefined}
          />
        )),
      );

      setSideMenuKey(genKey());
    }

    setRunEffect("effects-done");
  }, [gatewayConfig.chassis_model, menuList, runEffect]);

  useEffect(() => {
    if (gatewayConfig.chassis_model === "5010") {
      setRunEffect("tac-server-re-render");
    }
  }, [gatewayConfig.chassis_model]);

  return (
    <>
      <StyledMenu
        show={MenuContext.show}
        collapsed={MenuContext.collapsed}
        component={"aside"}
        bg={AppTheme.__default.appMenu.bg}
        bgImage={Images.sidebar}
        display={hideMenu === true ? "none !important" : "flex"}
        key={sideMenuKey}
      >
        <StyledMenuTrigger
          onClick={handleMenuClick}
          aria-label={"menu"}
          hoverBg={AppTheme.__default.appHamburger.hoverBg}
        >
          <StyledChevronRight
            className={MenuContext.collapsed ? " collapsed" : ""}
            collapseDelay={AppConfig.app.sideMenu.collapseDelay * 2.5}
            color={"#333"}
            size={"1em"}
          />
        </StyledMenuTrigger>

        <StyledUser>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            class="loginuser mx-3"
          >
            <IconButton
              id={`profile-preferences-button`}
              style={{
                backgroundColor: "#ddd",
                padding: "0.35em",
              }}
            >
              <Person
                style={{
                  fontSize: "0.65em",
                }}
              />
            </IconButton>
            <div>
              <Typography style={{ fontSize: "12px", color: "#FFFFFF" }}>
                {/* {captailizer(sessionName)} */}
                {captailizer(sessionName)}
                <span
                  style={{ fontSize: "9px", color: "#A6A6A6" }}
                  class="header_user_position"
                >
                  {captailizer(role)}
                </span>
              </Typography>
            </div>
          </div>

          <div class="bi bi-chevron-down">
            <ChevronDown
              color={AppTheme.__default.appMenuItemExpand.color}
              size={14}
            />
          </div>
        </StyledUser>

        <StyledMenuList
          className={MenuContext.collapsed ? " collapsed" : ""}
          collapseDelay={AppConfig.app.sideMenu.collapseDelay}
        >
          {generatedMenuElems}
        </StyledMenuList>
      </StyledMenu>

      {MenuContext.backdrop ? (
        <Styleddiv
          onClick={() => {
            MenuContext.setShow(true);
            MenuContext.setBackdrop(false);
          }}
        />
      ) : null}
    </>
  );
};

export default withRouter(withCookies(SideMenu));

const Styleddiv = styled.div`
  @media (max-width: 320px) {
    top: 0;
    left: 0;
    bottom: 50%;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    opacity: 9;
    z-index: 999;
    width: 100vw;
    height: 993px;
  }
  @media (min-width: 321px) and (max-width: 640px) {
    top: 0;
    left: 0;
    bottom: 50%;
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    opacity: 9;
    z-index: 999;
    width: 100vw;
    height: 993px;
  }
`;

import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Config from "../../Config";
import AppMenuContext from "./AppMenuContext";

const StyledLink = styled(Link)`
  display: flex;
  flex-wrap: nowrap;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 2em;
  padding: 1.25em 0.5em;
  ${(props) => {
    if (props.level > 0) {
      return "padding-left: " + props.level * 4 + "em;";
    }
  }}

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }

  &.selected {
    pointer-events: none;
    background-color: ${(props) => props.selectedBg};
    background-image: linear-gradient(#016bb7, #0082de);
  }

  &.has-sub-menu.selected {
    pointer-events: none;
    background-color: ${(props) => props.expandedBg};
    background-image: none;
  }

  &.expanded {
    background-color: ${(props) => props.expandedBg};
  }
`;

const StyledMenuItemIcon = styled(IconButton)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  background-color: ${(props) => props.bg};
  padding: 0.25em 0.25em 0.25em 0.25em;
  margin-right: 1em;

  &:hover {
    background-color: ${(props) => props.hoverBg};
  }

  &.no-icon {
    display: none;
    width: 1px;
    padding: 0em;
    opacity: 0;
    pointer-events: none;
  }
`;

const StyledMenuItemContent = styled(Typography)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  flex: 1 0 auto;

  &.no-icon {
    padding-left: 0em;
  }
`;

const StyledMenuItemName = styled(Typography)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  flex: 1 0 auto;
  /* font-family: Poppins; */
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1em;
  color: ${(props) => props.color};
  text-align: left;
  white-space: nowrap;
  margin-right: 0.5em;
`;

const StyledMenuItemExpand = styled(Typography)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  margin-left: 0.5em;
  margin-right: 0.5em;
`;

const StyledSubMenu = styled(MenuList)`
  width: 100%;
  height: ${(props) => props.height}px;
  transition: height ${(props) => props.collapseDelay / 1000}s ease-in;
  padding: 0em;
  overflow: hidden;
`;

const parseName = (word) => {
  const _word = word.toLocaleLowerCase().replace(/[^a-zA-Z0-9\s]/g, "");
  const $0 = _word.split(" ").filter((e) => e);
  const $1 = $0.splice(1).map((_) => _[0].toLocaleUpperCase() + _.slice(1));

  return [...$0, ...$1].join("");
};

const AppContentSideMenuItem = withRouter((props) => {
  const { t, i18n } = useTranslation();
  const AppConfig = useContext(Config);
  const AppTheme = AppConfig.themes[AppConfig.theme];
  const MenuContext = useContext(AppMenuContext);
  const menu = MenuContext.menu;

  let menuName = props.menuName;
  let menuItem = props.menuItem;
  let level = props.level;
  let parentName = props.parentName;

  let keys = Object.keys(menuItem);
  let nonMenuKeys = menu.__protectedKeys;

  nonMenuKeys.map((val) => {
    let index = keys.indexOf(val);
    if (index > -1) {
      keys.splice(index, 1);
    }
  });

  let subMenu = undefined;
  if (keys.length > 0) {
    subMenu = keys.map((name) => {
      return (
        <AppContentSideMenuItem
          menuName={name}
          menuItem={menuItem[name]}
          level={level + 1}
          parentName={menuName}
        />
      );
    });
  }

  let MenuIcon = menuItem.icon;

  let [hoverState, setHoverState] = useState(false);
  let [subMenuHeight, setSubMenuHeight] = useState(0);
  const subMenuRef = useRef();

  const toggleSubMenuExpand = () => {
    if (MenuContext.subMenuCollapsed[menuName]) {
      MenuContext.setSubMenuCollapsed[menuName](false);
      if (MenuContext.collapsed) {
        MenuContext.setCollapsed(!MenuContext.collapsed);
      }
    } else {
      MenuContext.setSubMenuCollapsed[menuName](true);
    }
  };

  useEffect(() => {
    if (MenuContext.subMenuCollapsed[menuName] === false) {
      let height = MenuContext.subMenuHeight[menuName];
      keys.forEach((menuKey) => {
        if (MenuContext.subMenuCollapsed[menuKey] === false) {
          height += MenuContext.subMenuHeight[menuKey];
        }
      });
      setSubMenuHeight(height);
      MenuContext.setSubMenuHeightNeedsUpdate[menuName](false);
    } else {
      setSubMenuHeight(0);
    }
    if (parentName) {
      MenuContext.setSubMenuHeightNeedsUpdate[parentName](true);
    }
  }, [
    MenuContext.subMenuCollapsed[menuName],
    MenuContext.subMenuHeightNeedsUpdate[menuName],
  ]);

  useEffect(() => {
    if (subMenu) {
      MenuContext.setSubMenuHeight[menuName](subMenuRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    MenuContext.setSubMenuCollapsed[menuName](
      MenuContext.collapsed ? true : !MenuContext.subMenuSelected[menuName],
    );
  }, [MenuContext.collapsed, MenuContext.subMenuSelected[menuName]]);

  useEffect(() => {
    if (parentName) {
      MenuContext.setSubMenuSelected[parentName](
        MenuContext.subMenuSelected[menuName],
      );
    }
  }, [MenuContext.subMenuSelected[menuName]]);

  if (
    props.location.pathname ===
    (AppConfig.pages[menuName] !== undefined
      ? AppConfig.pages[menuName].path
      : "")
  ) {
    // MenuContext. setPrevSelectedMenuItem ( MenuContext. selectedMenuItem ) ;
    if (MenuContext.selectedMenuItem !== null) {
      MenuContext.setSubMenuSelected[MenuContext.selectedMenuItem](false);
    }
    MenuContext.setSelectedMenuItem(menuName);
    MenuContext.setSubMenuSelected[menuName](true);
    if (parentName) {
      MenuContext.setSubMenuSelected[parentName](true);
    }
  }

  const MenuItemElem = () => {
    const navMenu = parentName
      ? `${parseName(MenuContext.menu[parentName].name)}.sub.${parseName(
          menuItem.name,
        )}`
      : `${parseName(menuItem.name)}`;

    return (
      <StyledMenuItem
        hoverBg={AppTheme.__default.appMenuItem.hoverBg}
        selectedBg={AppTheme.__default.appMenuItem.selectedBg}
        expandedBg={AppTheme.__default.appMenuItem.expandedBg}
        level={level}
        onMouseEnter={() => {
          setHoverState(true);
        }}
        onMouseLeave={() => {
          setHoverState(false);
        }}
        onClick={subMenu ? toggleSubMenuExpand : () => {}}
        className={
          (subMenu ? " has-sub-menu" : " is-leaf-node") +
          (MenuContext.subMenuSelected[menuName]
            ? " selected"
            : MenuContext.subMenuCollapsed[menuName]
            ? ""
            : " expanded")
        }
      >
        <StyledMenuItemIcon
          className={MenuIcon ? "" : "no-icon"}
          bg={AppTheme.__default.appMenuIcon.bg}
          hoverBg={AppTheme.__default.appMenuIcon.hoverBg}
          aria-label={menuItem.name}
        >
          {MenuIcon ? (
            <MenuIcon
              color={
                hoverState ||
                !MenuContext.subMenuCollapsed[menuName] ||
                MenuContext.subMenuSelected[menuName]
                  ? AppTheme.__default.appMenuIcon.hoverColor
                  : AppTheme.__default.appMenuIcon.color
              }
              size={20}
            />
          ) : (
            ""
          )}
        </StyledMenuItemIcon>
        <StyledMenuItemContent className={MenuIcon ? "" : "no-icon"}>
          <StyledMenuItemName color={AppTheme.__default.appMenuItem.color}>
            {t(`navigation.${navMenu}.text`)}
          </StyledMenuItemName>

          <StyledMenuItemExpand>
            {keys.length > 0 ? (
              subMenuHeight > 0 ? (
                <ChevronUp
                  color={AppTheme.__default.appMenuItemExpand.color}
                  size={14}
                />
              ) : (
                <ChevronDown
                  color={AppTheme.__default.appMenuItemExpand.color}
                  size={14}
                />
              )
            ) : (
              ""
            )}
          </StyledMenuItemExpand>
        </StyledMenuItemContent>
      </StyledMenuItem>
    );
  };

  return (
    <React.Fragment>
      {subMenu ? (
        <MenuItemElem />
      ) : (
        <StyledLink
          href={
            (
              AppConfig.pages[menuName] !== undefined
                ? AppConfig.pages[menuName].path
                : ""
            )
              ? AppConfig.pages[menuName] !== undefined
                ? AppConfig.pages[menuName].path
                : ""
              : "#"
          }
          onClick={(event) => {
            props.history.push(
              (
                AppConfig.pages[menuName] !== undefined
                  ? AppConfig.pages[menuName].path
                  : ""
              )
                ? AppConfig.pages[menuName] !== undefined
                  ? AppConfig.pages[menuName].path
                  : ""
                : "#",
            );
            event.preventDefault();
          }}
        >
          <MenuItemElem />
        </StyledLink>
      )}
      {subMenu ? (
        <StyledSubMenu
          collapseDelay={AppConfig.app.sideMenu.subMenu.collapseDelay}
          ref={subMenuRef}
          height={subMenuHeight}
        >
          {subMenu}
        </StyledSubMenu>
      ) : (
        ""
      )}
    </React.Fragment>
  );
});

export default withRouter(AppContentSideMenuItem);

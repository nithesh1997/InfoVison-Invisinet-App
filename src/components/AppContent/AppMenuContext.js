import { createContext, useContext, useState } from "react";
import {
  CardChecklist,
  ColumnsGap,
  Layers,
  ShieldCheck,
  Stoplights,
  Wrench,
} from "react-bootstrap-icons";
import Config from "../../Config";

const AppMenuInitialContext = {
  experiment: true,
  collapsed: true,
  selectedMenuItem: null,
  prevSelectedMenuItem: null,
  menu: {
    __protectedKeys: ["icon", "name", "parent"],
    // height, collapsed state and state variable needs to be created for every menu item.
    // `icon` and `parent` are optional, `name` is mandatory. Action paths are specified in `Config.js` and will be used only for menu items with no submenus.

    dsh: {
      icon: ColumnsGap,
      name: "Dashboard",
    },
    exp: {
      icon: Layers,
      name: "Manage",
    },
    idm: {
      name: "Identities",
      parent: "exp",
    },
    prs: {
      name: "Protected Resources",
      parent: "exp",
    },
    rsl: {
      name: "Resource Lists",
      parent: "exp",
    },
    urs: {
      name: "Unprotected Resources",
      parent: "exp",
    },
    rum: {
      name: "Rules",
      parent: "exp",
    },
    trl: {
      name: "Trust Level",
      parent: "exp",
    },
    mnw: {
      icon: ShieldCheck,
      name: "Configure",
    },
    dns: {
      name: "DNS / TAC Mode",
      parent: "mnw",
    },
    /* tac: {
      name: "TAC Mode",
      parent: "mnw",
    }, */
    ly3: {
      name: "Layer3",
      parent: "mnw",
    },
    apm: {
      name: "Applications",
      parent: "mnw",
    },
    set: {
      name: "Settings",
      parent: "mnw",
    },
    con: {
      name: "Configuration Logs",
      parent: "mnw",
    },
    gws: {
      icon: Wrench,
      name: "Gateway/Server",
    },
    tum: {
      name: "Services",
      parent: "gws",
    },
    flr: {
      name: "Filter Rules",
      parent: "gws",
    },
    /* gwm: {
      name: "Gateway Management",
      parent: "gws",
    }, // No longer has other dependent items */
    enm: {
      icon: Stoplights,
      name: "Endpoint",
    },
    enp: {
      name: "Configure",
      parent: "enm",
    },
    mfw: {
      name: "Firmware",
      parent: "enm",
    },
    tsk: {
      name: "Task Status",
      parent: "enm",
    },
    lgf: {
      name: "Log Files",
      parent: "enm",
    },
    mnt: {
      icon: CardChecklist,
      name: "Maintain",
    },
    /* tst: {
      name: "Troubleshooting",
      parent: "mnt",
    }, // No longer has other dependent items */
    rbt: {
      name: "Reboot",
      parent: "mnt",
    },
    /* slg: {
      name: "Syslog",
      parent: "mnt",
    }, */
    /* mnr: {
      icon: Display,
      name: "Monitoring",
    }, */
  },
  subMenuHeight: {
    dsh: 0,
    exp: 0,
    idm: 0,
    prs: 0,
    rsl: 0,
    urs: 0,
    rum: 0,
    trl: 0,
    mnw: 0,
    dns: 0,
    tac: 0,
    ly3: 0,
    rem: 0,
    apm: 0,
    set: 0,
    con: 0,
    gws: 0,
    flr: 0,
    enm: 0,
    tum: 0,
    enp: 0,
    mnt: 0,
    mfw: 0,
    tsk: 0,
    lgf: 0,
    rbt: 0,
    slg: 0,
    mnr: 0,
  },
  subMenuCollapsed: {
    dsh: true,
    exp: true,
    idm: true,
    prs: true,
    rsl: true,
    urs: true,
    rum: true,
    trl: true,
    mnw: true,
    dns: true,
    tac: true,
    ly3: true,
    set: true,
    con: true,
    rem: true,
    apm: true,
    gws: true,
    flr: true,
    enm: true,
    tum: true,
    enp: true,
    mnt: true,
    mfw: true,
    tsk: true,
    lgf: true,
    rbt: true,
    slg: true,
    mnr: true,
  },
  subMenuHeightNeedsUpdate: {
    dsh: false,
    exp: false,
    idm: false,
    prs: false,
    rsl: false,
    urs: false,
    rum: false,
    trl: false,
    mnw: false,
    dns: false,
    tac: false,
    ly3: false,
    set: false,
    con: false,
    rem: false,
    apm: false,
    gws: false,
    flr: false,
    enm: false,
    tum: false,
    enp: false,
    mnt: false,
    mfw: false,
    tsk: false,
    lgf: false,
    rbt: false,
    slg: false,
    mnr: false,
  },
  subMenuSelected: {
    dsh: false,
    exp: false,
    idm: false,
    prs: false,
    rsl: false,
    urs: false,
    rum: false,
    trl: false,
    mnw: false,
    dns: false,
    tac: false,
    ly3: false,
    set: false,
    con: false,
    rem: false,
    apm: false,
    gws: false,
    flr: false,
    enm: false,
    tum: false,
    enp: false,
    mnt: false,
    mfw: false,
    tsk: false,
    lgf: false,
    rbt: false,
    slg: false,
    mnr: false,
  },
  setSubMenuHeight: {
    dsh: undefined,
    exp: undefined,
    idm: undefined,
    prs: undefined,
    rsl: undefined,
    urs: undefined,
    rum: undefined,
    trl: undefined,
    mnw: undefined,
    dns: undefined,
    tac: undefined,
    ly3: undefined,
    set: undefined,
    con: undefined,
    rem: undefined,
    apm: undefined,
    gws: undefined,
    flr: undefined,
    enm: undefined,
    tum: undefined,
    enp: undefined,
    mnt: undefined,
    mfw: undefined,
    tsk: undefined,
    lgf: undefined,
    rbt: undefined,
    slg: undefined,
    mnr: undefined,
  },
  setSubMenuCollapsed: {
    dsh: undefined,
    exp: undefined,
    idm: undefined,
    prs: undefined,
    rsl: undefined,
    urs: undefined,
    rum: undefined,
    trl: undefined,
    mnw: undefined,
    dns: undefined,
    tac: undefined,
    ly3: undefined,
    set: undefined,
    con: undefined,
    rem: undefined,
    apm: undefined,
    gws: undefined,
    flr: undefined,
    enm: undefined,
    tum: undefined,
    enp: undefined,
    mnt: undefined,
    mfw: undefined,
    tsk: undefined,
    lgf: undefined,
    rbt: undefined,
    slg: undefined,
    mnr: undefined,
  },
  setSubMenuHeightNeedsUpdate: {
    dsh: undefined,
    exp: undefined,
    idm: undefined,
    prs: undefined,
    rsl: undefined,
    urs: undefined,
    rum: undefined,
    trl: undefined,
    mnw: undefined,
    dns: undefined,
    tac: undefined,
    ly3: undefined,
    set: undefined,
    con: undefined,
    rem: undefined,
    apm: undefined,
    gws: undefined,
    flr: undefined,
    enm: undefined,
    tum: undefined,
    enp: undefined,
    mnt: undefined,
    mfw: undefined,
    tsk: undefined,
    lgf: undefined,
    rbt: undefined,
    slg: undefined,
    mnr: undefined,
  },
  setSubMenuSelected: {
    dsh: undefined,
    exp: undefined,
    idm: undefined,
    prs: undefined,
    rsl: undefined,
    urs: undefined,
    rum: undefined,
    trl: undefined,
    mnw: undefined,
    dns: undefined,
    tac: undefined,
    ly3: undefined,
    set: undefined,
    con: undefined,
    rem: undefined,
    apm: undefined,
    gws: undefined,
    flr: undefined,
    enm: undefined,
    tum: undefined,
    enp: undefined,
    mnt: undefined,
    mfw: undefined,
    tsk: undefined,
    lgf: undefined,
    rbt: undefined,
    slg: undefined,
    mnr: undefined,
  },
};

const AppMenuContext = createContext(AppMenuInitialContext);

const AppMenuContextProvider = (props) => {
  const AppConfig = useContext(Config);
  let storedCollapsed = localStorage.getItem("ba-menu-collapsed");

  if (storedCollapsed === "true") {
    storedCollapsed = true;
  } else if (storedCollapsed === "false") {
    storedCollapsed = false;
  } else {
    storedCollapsed = AppMenuInitialContext.collapsed;
    localStorage.setItem("ba-menu-collapsed", storedCollapsed);
  }

  let [collapsed, setCollapsed] = useState(storedCollapsed);
  let [experiment, setExperiment] = useState(AppMenuInitialContext.experiment);
  let [show, setShow] = useState(false);
  let [backdrop, setBackdrop] = useState(false);
  let [selectedMenuItem, setSelectedMenuItem] = useState(
    AppMenuInitialContext.selectedMenuItem,
  );

  let [prevSelectedMenuItem, setPrevSelectedMenuItem] = useState(
    AppMenuInitialContext.prevSelectedMenuItem,
  );

  let [subMenuHeight_dsh, setSubMenuHeight_dsh] = useState(
    AppMenuInitialContext.subMenuHeight.dsh,
  );

  let [subMenuHeight_exp, setSubMenuHeight_exp] = useState(
    AppMenuInitialContext.subMenuHeight.exp,
  );

  let [subMenuHeight_idm, setSubMenuHeight_idm] = useState(
    AppMenuInitialContext.subMenuHeight.idm,
  );

  let [subMenuHeight_prs, setSubMenuHeight_prs] = useState(
    AppMenuInitialContext.subMenuHeight.prs,
  );

  let [subMenuHeight_rsl, setSubMenuHeight_rsl] = useState(
    AppMenuInitialContext.subMenuHeight.rsl,
  );

  let [subMenuHeight_urs, setSubMenuHeight_urs] = useState(
    AppMenuInitialContext.subMenuHeight.urs,
  );

  let [subMenuHeight_rum, setSubMenuHeight_rum] = useState(
    AppMenuInitialContext.subMenuHeight.rum,
  );

  let [subMenuHeight_trl, setSubMenuHeight_trl] = useState(
    AppMenuInitialContext.subMenuHeight.trl,
  );

  let [subMenuHeight_mnw, setSubMenuHeight_mnw] = useState(
    AppMenuInitialContext.subMenuHeight.mnw,
  );

  let [subMenuHeight_dns, setSubMenuHeight_dns] = useState(
    AppMenuInitialContext.subMenuHeight.dns,
  );

  let [subMenuHeight_tac, setSubMenuHeight_tac] = useState(
    AppMenuInitialContext.subMenuHeight.tac,
  );

  let [subMenuHeight_ly3, setSubMenuHeight_ly3] = useState(
    AppMenuInitialContext.subMenuHeight.ly3,
  );

  let [subMenuHeight_rem, setSubMenuHeight_rem] = useState(
    AppMenuInitialContext.subMenuHeight.rem,
  );

  let [subMenuHeight_apm, setSubMenuHeight_apm] = useState(
    AppMenuInitialContext.subMenuHeight.apm,
  );

  let [subMenuHeight_gws, setSubMenuHeight_gws] = useState(
    AppMenuInitialContext.subMenuHeight.gws,
  );

  let [subMenuHeight_set, setSubMenuHeight_set] = useState(
    AppMenuInitialContext.subMenuHeight.set,
  );

  let [subMenuHeight_con, setSubMenuHeight_con] = useState(
    AppMenuInitialContext.subMenuHeight.con,
  );

  let [subMenuHeight_flr, setSubMenuHeight_flr] = useState(
    AppMenuInitialContext.subMenuHeight.flr,
  );

  let [subMenuHeight_enm, setSubMenuHeight_enm] = useState(
    AppMenuInitialContext.subMenuHeight.enm,
  );

  let [subMenuHeight_tum, setSubMenuHeight_tum] = useState(
    AppMenuInitialContext.subMenuHeight.tum,
  );

  let [subMenuHeight_enp, setSubMenuHeight_enp] = useState(
    AppMenuInitialContext.subMenuHeight.enp,
  );

  let [subMenuHeight_mnt, setSubMenuHeight_mnt] = useState(
    AppMenuInitialContext.subMenuHeight.mnt,
  );

  let [subMenuHeight_mfw, setSubMenuHeight_mfw] = useState(
    AppMenuInitialContext.subMenuHeight.mfw,
  );

  let [subMenuHeight_tsk, setSubMenuHeight_tsk] = useState(
    AppMenuInitialContext.subMenuHeight.tsk,
  );

  let [subMenuHeight_lgf, setSubMenuHeight_lgf] = useState(
    AppMenuInitialContext.subMenuHeight.lgf,
  );

  let [subMenuHeight_rbt, setSubMenuHeight_rbt] = useState(
    AppMenuInitialContext.subMenuHeight.rbt,
  );

  let [subMenuHeight_slg, setSubMenuHeight_slg] = useState(
    AppMenuInitialContext.subMenuHeight.slg,
  );

  let [subMenuHeight_mnr, setSubMenuHeight_mnr] = useState(
    AppMenuInitialContext.subMenuHeight.mnr,
  );

  let [subMenuCollapsed_dsh, setSubMenuCollapsed_dsh] = useState(
    AppMenuInitialContext.subMenuCollapsed.dsh,
  );
  let [subMenuCollapsed_exp, setSubMenuCollapsed_exp] = useState(
    AppMenuInitialContext.subMenuCollapsed.exp,
  );
  let [subMenuCollapsed_idm, setSubMenuCollapsed_idm] = useState(
    AppMenuInitialContext.subMenuCollapsed.idm,
  );
  let [subMenuCollapsed_prs, setSubMenuCollapsed_prs] = useState(
    AppMenuInitialContext.subMenuCollapsed.prs,
  );
  let [subMenuCollapsed_rsl, setSubMenuCollapsed_rsl] = useState(
    AppMenuInitialContext.subMenuCollapsed.rsl,
  );
  let [subMenuCollapsed_urs, setSubMenuCollapsed_urs] = useState(
    AppMenuInitialContext.subMenuCollapsed.urs,
  );
  let [subMenuCollapsed_rum, setSubMenuCollapsed_rum] = useState(
    AppMenuInitialContext.subMenuCollapsed.rum,
  );
  let [subMenuCollapsed_trl, setSubMenuCollapsed_trl] = useState(
    AppMenuInitialContext.subMenuCollapsed.trl,
  );
  let [subMenuCollapsed_mnw, setSubMenuCollapsed_mnw] = useState(
    AppMenuInitialContext.subMenuCollapsed.mnw,
  );
  let [subMenuCollapsed_dns, setSubMenuCollapsed_dns] = useState(
    AppMenuInitialContext.subMenuCollapsed.dns,
  );
  let [subMenuCollapsed_tac, setSubMenuCollapsed_tac] = useState(
    AppMenuInitialContext.subMenuCollapsed.tac,
  );
  let [subMenuCollapsed_ly3, setSubMenuCollapsed_ly3] = useState(
    AppMenuInitialContext.subMenuCollapsed.ly3,
  );
  let [subMenuCollapsed_rem, setSubMenuCollapsed_rem] = useState(
    AppMenuInitialContext.subMenuCollapsed.rem,
  );
  let [subMenuCollapsed_apm, setSubMenuCollapsed_apm] = useState(
    AppMenuInitialContext.subMenuCollapsed.apm,
  );

  let [subMenuCollapsed_set, setSubMenuCollapsed_set] = useState(
    AppMenuInitialContext.subMenuCollapsed.set,
  );

  let [subMenuCollapsed_con, setSubMenuCollapsed_con] = useState(
    AppMenuInitialContext.subMenuCollapsed.con,
  );

  let [subMenuCollapsed_gws, setSubMenuCollapsed_gws] = useState(
    AppMenuInitialContext.subMenuCollapsed.gws,
  );
  let [subMenuCollapsed_flr, setSubMenuCollapsed_flr] = useState(
    AppMenuInitialContext.subMenuCollapsed.flr,
  );
  let [subMenuCollapsed_enm, setSubMenuCollapsed_enm] = useState(
    AppMenuInitialContext.subMenuCollapsed.enm,
  );
  let [subMenuCollapsed_tum, setSubMenuCollapsed_tum] = useState(
    AppMenuInitialContext.subMenuCollapsed.tum,
  );
  let [subMenuCollapsed_enp, setSubMenuCollapsed_enp] = useState(
    AppMenuInitialContext.subMenuCollapsed.enp,
  );
  let [subMenuCollapsed_mnt, setSubMenuCollapsed_mnt] = useState(
    AppMenuInitialContext.subMenuCollapsed.mnt,
  );
  let [subMenuCollapsed_mfw, setSubMenuCollapsed_mfw] = useState(
    AppMenuInitialContext.subMenuCollapsed.mfw,
  );
  let [subMenuCollapsed_tsk, setSubMenuCollapsed_tsk] = useState(
    AppMenuInitialContext.subMenuCollapsed.tsk,
  );
  let [subMenuCollapsed_lgf, setSubMenuCollapsed_lgf] = useState(
    AppMenuInitialContext.subMenuCollapsed.lgf,
  );
  let [subMenuCollapsed_rbt, setSubMenuCollapsed_rbt] = useState(
    AppMenuInitialContext.subMenuCollapsed.rbt,
  );
  let [subMenuCollapsed_slg, setSubMenuCollapsed_slg] = useState(
    AppMenuInitialContext.subMenuCollapsed.slg,
  );
  let [subMenuCollapsed_mnr, setSubMenuCollapsed_mnr] = useState(
    AppMenuInitialContext.subMenuCollapsed.mnr,
  );

  let [subMenuHeightNeedsUpdate_dsh, setSubMenuHeightNeedsUpdate_dsh] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.dsh);
  let [subMenuHeightNeedsUpdate_exp, setSubMenuHeightNeedsUpdate_exp] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.exp);
  let [subMenuHeightNeedsUpdate_idm, setSubMenuHeightNeedsUpdate_idm] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.idm);
  let [subMenuHeightNeedsUpdate_prs, setSubMenuHeightNeedsUpdate_prs] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.prs);
  let [subMenuHeightNeedsUpdate_rsl, setSubMenuHeightNeedsUpdate_rsl] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.rsl);
  let [subMenuHeightNeedsUpdate_urs, setSubMenuHeightNeedsUpdate_urs] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.urs);
  let [subMenuHeightNeedsUpdate_rum, setSubMenuHeightNeedsUpdate_rum] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.rum);
  let [subMenuHeightNeedsUpdate_trl, setSubMenuHeightNeedsUpdate_trl] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.trl);
  let [subMenuHeightNeedsUpdate_mnw, setSubMenuHeightNeedsUpdate_mnw] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.mnw);
  let [subMenuHeightNeedsUpdate_dns, setSubMenuHeightNeedsUpdate_dns] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.dns);
  let [subMenuHeightNeedsUpdate_tac, setSubMenuHeightNeedsUpdate_tac] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.tac);
  let [subMenuHeightNeedsUpdate_ly3, setSubMenuHeightNeedsUpdate_ly3] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.ly3);
  let [subMenuHeightNeedsUpdate_rem, setSubMenuHeightNeedsUpdate_rem] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.rem);
  let [subMenuHeightNeedsUpdate_apm, setSubMenuHeightNeedsUpdate_apm] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.apm);
  let [subMenuHeightNeedsUpdate_set, setSubMenuHeightNeedsUpdate_set] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.set);
  let [subMenuHeightNeedsUpdate_con, setSubMenuHeightNeedsUpdate_con] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.con);
  let [subMenuHeightNeedsUpdate_gws, setSubMenuHeightNeedsUpdate_gws] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.gws);
  let [subMenuHeightNeedsUpdate_flr, setSubMenuHeightNeedsUpdate_flr] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.flr);
  let [subMenuHeightNeedsUpdate_enm, setSubMenuHeightNeedsUpdate_enm] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.enm);
  let [subMenuHeightNeedsUpdate_tum, setSubMenuHeightNeedsUpdate_tum] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.tum);
  let [subMenuHeightNeedsUpdate_enp, setSubMenuHeightNeedsUpdate_enp] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.enp);
  let [subMenuHeightNeedsUpdate_mnt, setSubMenuHeightNeedsUpdate_mnt] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.mnt);
  let [subMenuHeightNeedsUpdate_mfw, setSubMenuHeightNeedsUpdate_mfw] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.mfw);
  let [subMenuHeightNeedsUpdate_tsk, setSubMenuHeightNeedsUpdate_tsk] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.tsk);
  let [subMenuHeightNeedsUpdate_lgf, setSubMenuHeightNeedsUpdate_lgf] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.lgf);
  let [subMenuHeightNeedsUpdate_rbt, setSubMenuHeightNeedsUpdate_rbt] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.rbt);
  let [subMenuHeightNeedsUpdate_slg, setSubMenuHeightNeedsUpdate_slg] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.slg);
  let [subMenuHeightNeedsUpdate_mnr, setSubMenuHeightNeedsUpdate_mnr] =
    useState(AppMenuInitialContext.subMenuHeightNeedsUpdate.mnr);

  let [subMenuSelected_dsh, setSubMenuSelected_dsh] = useState(
    AppMenuInitialContext.subMenuSelected.dsh,
  );
  let [subMenuSelected_exp, setSubMenuSelected_exp] = useState(
    AppMenuInitialContext.subMenuSelected.exp,
  );
  let [subMenuSelected_idm, setSubMenuSelected_idm] = useState(
    AppMenuInitialContext.subMenuSelected.idm,
  );
  let [subMenuSelected_prs, setSubMenuSelected_prs] = useState(
    AppMenuInitialContext.subMenuSelected.prs,
  );
  let [subMenuSelected_rsl, setSubMenuSelected_rsl] = useState(
    AppMenuInitialContext.subMenuSelected.rsl,
  );
  let [subMenuSelected_urs, setSubMenuSelected_urs] = useState(
    AppMenuInitialContext.subMenuSelected.urs,
  );
  let [subMenuSelected_rum, setSubMenuSelected_rum] = useState(
    AppMenuInitialContext.subMenuSelected.rum,
  );
  let [subMenuSelected_trl, setSubMenuSelected_trl] = useState(
    AppMenuInitialContext.subMenuSelected.trl,
  );
  let [subMenuSelected_mnw, setSubMenuSelected_mnw] = useState(
    AppMenuInitialContext.subMenuSelected.mnw,
  );
  let [subMenuSelected_dns, setSubMenuSelected_dns] = useState(
    AppMenuInitialContext.subMenuSelected.dns,
  );
  let [subMenuSelected_tac, setSubMenuSelected_tac] = useState(
    AppMenuInitialContext.subMenuSelected.tac,
  );
  let [subMenuSelected_ly3, setSubMenuSelected_ly3] = useState(
    AppMenuInitialContext.subMenuSelected.ly3,
  );
  let [subMenuSelected_rem, setSubMenuSelected_rem] = useState(
    AppMenuInitialContext.subMenuSelected.rem,
  );
  let [subMenuSelected_apm, setSubMenuSelected_apm] = useState(
    AppMenuInitialContext.subMenuSelected.apm,
  );
  let [subMenuSelected_set, setSubMenuSelected_set] = useState(
    AppMenuInitialContext.subMenuSelected.set,
  );
  let [subMenuSelected_con, setSubMenuSelected_con] = useState(
    AppMenuInitialContext.subMenuSelected.con,
  );
  let [subMenuSelected_gws, setSubMenuSelected_gws] = useState(
    AppMenuInitialContext.subMenuSelected.gws,
  );
  let [subMenuSelected_flr, setSubMenuSelected_flr] = useState(
    AppMenuInitialContext.subMenuSelected.flr,
  );
  let [subMenuSelected_enm, setSubMenuSelected_enm] = useState(
    AppMenuInitialContext.subMenuSelected.enm,
  );
  let [subMenuSelected_tum, setSubMenuSelected_tum] = useState(
    AppMenuInitialContext.subMenuSelected.tum,
  );
  let [subMenuSelected_enp, setSubMenuSelected_enp] = useState(
    AppMenuInitialContext.subMenuSelected.enp,
  );
  let [subMenuSelected_mnt, setSubMenuSelected_mnt] = useState(
    AppMenuInitialContext.subMenuSelected.mnt,
  );
  let [subMenuSelected_mfw, setSubMenuSelected_mfw] = useState(
    AppMenuInitialContext.subMenuSelected.mfw,
  );
  let [subMenuSelected_tsk, setSubMenuSelected_tsk] = useState(
    AppMenuInitialContext.subMenuSelected.tsk,
  );
  let [subMenuSelected_lgf, setSubMenuSelected_lgf] = useState(
    AppMenuInitialContext.subMenuSelected.lgf,
  );
  let [subMenuSelected_rbt, setSubMenuSelected_rbt] = useState(
    AppMenuInitialContext.subMenuSelected.rbt,
  );
  let [subMenuSelected_slg, setSubMenuSelected_slg] = useState(
    AppMenuInitialContext.subMenuSelected.slg,
  );
  let [subMenuSelected_mnr, setSubMenuSelected_mnr] = useState(
    AppMenuInitialContext.subMenuSelected.mnr,
  );

  const subMenuHeight = {
    dsh: subMenuHeight_dsh,
    exp: subMenuHeight_exp,
    idm: subMenuHeight_idm,
    prs: subMenuHeight_prs,
    rsl: subMenuHeight_rsl,
    urs: subMenuHeight_urs,
    rum: subMenuHeight_rum,
    trl: subMenuHeight_trl,
    mnw: subMenuHeight_mnw,
    dns: subMenuHeight_dns,
    tac: subMenuHeight_tac,
    ly3: subMenuHeight_ly3,
    rem: subMenuHeight_rem,
    apm: subMenuHeight_apm,
    set: subMenuHeight_set,
    con: subMenuHeight_con,
    gws: subMenuHeight_gws,
    flr: subMenuHeight_flr,
    enm: subMenuHeight_enm,
    tum: subMenuHeight_tum,
    enp: subMenuHeight_enp,
    mnt: subMenuHeight_mnt,
    mfw: subMenuHeight_mfw,
    tsk: subMenuHeight_tsk,
    lgf: subMenuHeight_lgf,
    rbt: subMenuHeight_rbt,
    slg: subMenuHeight_slg,
    mnr: subMenuHeight_mnr,
  };

  const setSubMenuHeight = {
    dsh: (val) => {
      setSubMenuHeight_dsh(val);
    },
    exp: (val) => {
      setSubMenuHeight_exp(val);
    },
    idm: (val) => {
      setSubMenuHeight_idm(val);
    },
    prs: (val) => {
      setSubMenuHeight_prs(val);
    },
    rsl: (val) => {
      setSubMenuHeight_rsl(val);
    },
    urs: (val) => {
      setSubMenuHeight_urs(val);
    },
    rum: (val) => {
      setSubMenuHeight_rum(val);
    },
    trl: (val) => {
      setSubMenuHeight_trl(val);
    },
    mnw: (val) => {
      setSubMenuHeight_mnw(val);
    },
    dns: (val) => {
      setSubMenuHeight_dns(val);
    },
    tac: (val) => {
      setSubMenuHeight_tac(val);
    },
    ly3: (val) => {
      setSubMenuHeight_ly3(val);
    },
    rem: (val) => {
      setSubMenuHeight_rem(val);
    },
    apm: (val) => {
      setSubMenuHeight_apm(val);
    },
    set: (val) => {
      setSubMenuHeight_set(val);
    },
    con: (val) => {
      setSubMenuHeight_con(val);
    },
    gws: (val) => {
      setSubMenuHeight_gws(val);
    },
    flr: (val) => {
      setSubMenuHeight_flr(val);
    },
    enm: (val) => {
      setSubMenuHeight_enm(val);
    },
    tum: (val) => {
      setSubMenuHeight_tum(val);
    },
    enp: (val) => {
      setSubMenuHeight_enp(val);
    },
    mnt: (val) => {
      setSubMenuHeight_mnt(val);
    },
    mfw: (val) => {
      setSubMenuHeight_mfw(val);
    },
    tsk: (val) => {
      setSubMenuHeight_tsk(val);
    },
    lgf: (val) => {
      setSubMenuHeight_lgf(val);
    },
    rbt: (val) => {
      setSubMenuHeight_rbt(val);
    },
    slg: (val) => {
      setSubMenuHeight_slg(val);
    },
    mnr: (val) => {
      setSubMenuHeight_mnr(val);
    },
  };

  const subMenuCollapsed = {
    dsh: subMenuCollapsed_dsh,
    exp: subMenuCollapsed_exp,
    idm: subMenuCollapsed_idm,
    prs: subMenuCollapsed_prs,
    rsl: subMenuCollapsed_rsl,
    urs: subMenuCollapsed_urs,
    rum: subMenuCollapsed_rum,
    trl: subMenuCollapsed_trl,
    mnw: subMenuCollapsed_mnw,
    dns: subMenuCollapsed_dns,
    tac: subMenuCollapsed_tac,
    ly3: subMenuCollapsed_ly3,
    rem: subMenuCollapsed_rem,
    apm: subMenuCollapsed_apm,
    set: subMenuCollapsed_set,
    con: subMenuCollapsed_con,
    gws: subMenuCollapsed_gws,
    flr: subMenuCollapsed_flr,
    enm: subMenuCollapsed_enm,
    tum: subMenuCollapsed_tum,
    enp: subMenuCollapsed_enp,
    mnt: subMenuCollapsed_mnt,
    mfw: subMenuCollapsed_mfw,
    tsk: subMenuCollapsed_tsk,
    lgf: subMenuCollapsed_lgf,
    rbt: subMenuCollapsed_rbt,
    slg: subMenuCollapsed_slg,
    mnr: subMenuCollapsed_mnr,
  };

  const setSubMenuCollapsed = {
    dsh: (val) => {
      setSubMenuCollapsed_dsh(val);
    },
    exp: (val) => {
      setSubMenuCollapsed_exp(val);
    },
    idm: (val) => {
      setSubMenuCollapsed_idm(val);
    },
    prs: (val) => {
      setSubMenuCollapsed_prs(val);
    },
    rsl: (val) => {
      setSubMenuCollapsed_rsl(val);
    },
    urs: (val) => {
      setSubMenuCollapsed_urs(val);
    },
    rum: (val) => {
      setSubMenuCollapsed_rum(val);
    },
    trl: (val) => {
      setSubMenuCollapsed_trl(val);
    },
    mnw: (val) => {
      setSubMenuCollapsed_mnw(val);
    },
    dns: (val) => {
      setSubMenuCollapsed_dns(val);
    },
    tac: (val) => {
      setSubMenuCollapsed_tac(val);
    },
    ly3: (val) => {
      setSubMenuCollapsed_ly3(val);
    },
    rem: (val) => {
      setSubMenuCollapsed_rem(val);
    },
    apm: (val) => {
      setSubMenuCollapsed_apm(val);
    },
    set: (val) => {
      setSubMenuCollapsed_set(val);
    },
    con: (val) => {
      setSubMenuCollapsed_con(val);
    },
    gws: (val) => {
      setSubMenuCollapsed_gws(val);
    },
    flr: (val) => {
      setSubMenuCollapsed_flr(val);
    },
    enm: (val) => {
      setSubMenuCollapsed_enm(val);
    },
    tum: (val) => {
      setSubMenuCollapsed_tum(val);
    },
    enp: (val) => {
      setSubMenuCollapsed_enp(val);
    },
    mnt: (val) => {
      setSubMenuCollapsed_mnt(val);
    },
    mfw: (val) => {
      setSubMenuCollapsed_mfw(val);
    },
    tsk: (val) => {
      setSubMenuCollapsed_tsk(val);
    },
    lgf: (val) => {
      setSubMenuCollapsed_lgf(val);
    },
    rbt: (val) => {
      setSubMenuCollapsed_rbt(val);
    },
    slg: (val) => {
      setSubMenuCollapsed_slg(val);
    },
    mnr: (val) => {
      setSubMenuCollapsed_mnr(val);
    },
  };

  const subMenuHeightNeedsUpdate = {
    dsh: subMenuHeightNeedsUpdate_dsh,
    exp: subMenuHeightNeedsUpdate_exp,
    idm: subMenuHeightNeedsUpdate_idm,
    prs: subMenuHeightNeedsUpdate_prs,
    rsl: subMenuHeightNeedsUpdate_rsl,
    urs: subMenuHeightNeedsUpdate_urs,
    rum: subMenuHeightNeedsUpdate_rum,
    trl: subMenuHeightNeedsUpdate_trl,
    mnw: subMenuHeightNeedsUpdate_mnw,
    dns: subMenuHeightNeedsUpdate_dns,
    tac: subMenuHeightNeedsUpdate_tac,
    ly3: subMenuHeightNeedsUpdate_ly3,
    rem: subMenuHeightNeedsUpdate_rem,
    apm: subMenuHeightNeedsUpdate_apm,
    set: subMenuHeightNeedsUpdate_set,
    con: subMenuHeightNeedsUpdate_con,
    gws: subMenuHeightNeedsUpdate_gws,
    flr: subMenuHeightNeedsUpdate_flr,
    enm: subMenuHeightNeedsUpdate_enm,
    tum: subMenuHeightNeedsUpdate_tum,
    enp: subMenuHeightNeedsUpdate_enp,
    mnt: subMenuHeightNeedsUpdate_mnt,
    mfw: subMenuHeightNeedsUpdate_mfw,
    tsk: subMenuHeightNeedsUpdate_tsk,
    lgf: subMenuHeightNeedsUpdate_lgf,
    rbt: subMenuHeightNeedsUpdate_rbt,
    slg: subMenuHeightNeedsUpdate_slg,
    mnr: subMenuHeightNeedsUpdate_mnr,
  };

  const setSubMenuHeightNeedsUpdate = {
    dsh: (val) => {
      setSubMenuHeightNeedsUpdate_dsh(val);
    },
    exp: (val) => {
      setSubMenuHeightNeedsUpdate_exp(val);
    },
    idm: (val) => {
      setSubMenuHeightNeedsUpdate_idm(val);
    },
    prs: (val) => {
      setSubMenuHeightNeedsUpdate_prs(val);
    },
    rsl: (val) => {
      setSubMenuHeightNeedsUpdate_rsl(val);
    },
    urs: (val) => {
      setSubMenuHeightNeedsUpdate_urs(val);
    },
    rum: (val) => {
      setSubMenuHeightNeedsUpdate_rum(val);
    },
    trl: (val) => {
      setSubMenuHeightNeedsUpdate_trl(val);
    },
    mnw: (val) => {
      setSubMenuHeightNeedsUpdate_mnw(val);
    },
    dns: (val) => {
      setSubMenuHeightNeedsUpdate_dns(val);
    },
    tac: (val) => {
      setSubMenuHeightNeedsUpdate_tac(val);
    },
    ly3: (val) => {
      setSubMenuHeightNeedsUpdate_ly3(val);
    },
    rem: (val) => {
      setSubMenuHeightNeedsUpdate_rem(val);
    },
    apm: (val) => {
      setSubMenuHeightNeedsUpdate_apm(val);
    },
    set: (val) => {
      setSubMenuHeightNeedsUpdate_set(val);
    },
    con: (val) => {
      setSubMenuHeightNeedsUpdate_con(val);
    },
    gws: (val) => {
      setSubMenuHeightNeedsUpdate_gws(val);
    },
    flr: (val) => {
      setSubMenuHeightNeedsUpdate_flr(val);
    },
    enm: (val) => {
      setSubMenuHeightNeedsUpdate_enm(val);
    },
    tum: (val) => {
      setSubMenuHeightNeedsUpdate_tum(val);
    },
    enp: (val) => {
      setSubMenuHeightNeedsUpdate_enp(val);
    },
    mnt: (val) => {
      setSubMenuHeightNeedsUpdate_mnt(val);
    },
    mfw: (val) => {
      setSubMenuHeightNeedsUpdate_mfw(val);
    },
    tsk: (val) => {
      setSubMenuHeightNeedsUpdate_tsk(val);
    },
    lgf: (val) => {
      setSubMenuHeightNeedsUpdate_lgf(val);
    },
    rbt: (val) => {
      setSubMenuHeightNeedsUpdate_rbt(val);
    },
    slg: (val) => {
      setSubMenuHeightNeedsUpdate_slg(val);
    },
    mnr: (val) => {
      setSubMenuHeightNeedsUpdate_mnr(val);
    },
  };

  const subMenuSelected = {
    dsh: subMenuSelected_dsh,
    exp: subMenuSelected_exp,
    idm: subMenuSelected_idm,
    prs: subMenuSelected_prs,
    rsl: subMenuSelected_rsl,
    urs: subMenuSelected_urs,
    rum: subMenuSelected_rum,
    trl: subMenuSelected_trl,
    mnw: subMenuSelected_mnw,
    dns: subMenuSelected_dns,
    tac: subMenuSelected_tac,
    ly3: subMenuSelected_ly3,
    rem: subMenuSelected_rem,
    apm: subMenuSelected_apm,
    set: subMenuSelected_set,
    con: subMenuSelected_con,
    gws: subMenuSelected_gws,
    flr: subMenuSelected_flr,
    enm: subMenuSelected_enm,
    tum: subMenuSelected_tum,
    enp: subMenuSelected_enp,
    mnt: subMenuSelected_mnt,
    mfw: subMenuSelected_mfw,
    tsk: subMenuSelected_tsk,
    lgf: subMenuSelected_lgf,
    rbt: subMenuSelected_rbt,
    slg: subMenuSelected_slg,
    mnr: subMenuSelected_mnr,
  };

  const setSubMenuSelected = {
    dsh: (val) => {
      setSubMenuSelected_dsh(val);
    },
    exp: (val) => {
      setSubMenuSelected_exp(val);
    },
    idm: (val) => {
      setSubMenuSelected_idm(val);
    },
    prs: (val) => {
      setSubMenuSelected_prs(val);
    },
    rsl: (val) => {
      setSubMenuSelected_rsl(val);
    },
    urs: (val) => {
      setSubMenuSelected_urs(val);
    },
    rum: (val) => {
      setSubMenuSelected_rum(val);
    },
    trl: (val) => {
      setSubMenuSelected_trl(val);
    },
    mnw: (val) => {
      setSubMenuSelected_mnw(val);
    },
    dns: (val) => {
      setSubMenuSelected_dns(val);
    },
    tac: (val) => {
      setSubMenuSelected_tac(val);
    },
    ly3: (val) => {
      setSubMenuSelected_ly3(val);
    },
    rem: (val) => {
      setSubMenuSelected_rem(val);
    },
    apm: (val) => {
      setSubMenuSelected_apm(val);
    },
    set: (val) => {
      setSubMenuSelected_set(val);
    },
    con: (val) => {
      setSubMenuSelected_con(val);
    },
    gws: (val) => {
      setSubMenuSelected_gws(val);
    },
    flr: (val) => {
      setSubMenuSelected_flr(val);
    },
    enm: (val) => {
      setSubMenuSelected_enm(val);
    },
    tum: (val) => {
      setSubMenuSelected_tum(val);
    },
    enp: (val) => {
      setSubMenuSelected_enp(val);
    },
    mnt: (val) => {
      setSubMenuSelected_mnt(val);
    },
    mfw: (val) => {
      setSubMenuSelected_mfw(val);
    },
    tsk: (val) => {
      setSubMenuSelected_tsk(val);
    },
    lgf: (val) => {
      setSubMenuSelected_lgf(val);
    },
    rbt: (val) => {
      setSubMenuSelected_rbt(val);
    },
    slg: (val) => {
      setSubMenuSelected_slg(val);
    },
    mnr: (val) => {
      setSubMenuSelected_mnr(val);
    },
  };

  const AppMenu = {
    ...AppMenuInitialContext,
  };

  const statefulContext = {
    ...AppMenu,
    experiment: experiment,
    show: show,
    backdrop: backdrop,
    collapsed: collapsed,
    selectedMenuItem: selectedMenuItem,
    prevSelectedMenuItem: prevSelectedMenuItem,
    subMenuHeight: subMenuHeight,
    setSubMenuHeight: setSubMenuHeight,
    subMenuCollapsed: subMenuCollapsed,
    setSubMenuCollapsed: setSubMenuCollapsed,
    subMenuHeightNeedsUpdate: subMenuHeightNeedsUpdate,
    setSubMenuHeightNeedsUpdate: setSubMenuHeightNeedsUpdate,
    subMenuSelected: subMenuSelected,
    setSubMenuSelected: setSubMenuSelected,
    setExperiment: (val) => {
      setExperiment(val);
    },
    setShow: (val) => {
      setShow(val);
    },
    setBackdrop: (val) => {
      setBackdrop(val);
    },
    setCollapsed: (val) => {
      setCollapsed(val);
      localStorage.setItem("ba-menu-collapsed", val);
    },
    setSelectedMenuItem: (val) => {
      setSelectedMenuItem(val);
    },
    setPrevSelectedMenuItem: (val) => {
      setPrevSelectedMenuItem(val);
    },
  };

  return (
    <AppMenuContext.Provider value={statefulContext}>
      {props.children}
    </AppMenuContext.Provider>
  );
};

export { AppMenuInitialContext, AppMenuContextProvider };
export default AppMenuContext;

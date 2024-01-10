import { getCurrentGatewayStatus } from "./common/get-current-gateway-status/getCurrentGatewayStatus";
import { getGatewaysStatus } from "./common/get-gateways-status/getGatewaysStatus";
import { getNotifications } from "./common/get-notifications/getNotifications";
import { getOpConfig } from "./common/get-op-config/getOpConfig";
import { isBem } from "./common/is-bem/isBem";
import { login } from "./common/login/login";
import { logout } from "./common/logout/logout";
import { deleteApplication } from "./configure/applications/delete-application/delete-application";
import { getApplications } from "./configure/applications/get-applications/getApplications";
import { getPorts } from "./configure/applications/get-ports/getPorts";
import { saveApplication } from "./configure/applications/save-application/saveApplication";
import { getConfigurationLogs } from "./configure/configuration-logs/get-configuration-logs/getConfigurationLogs";
import { configurationList } from "./configure/configuration/configuration-list/configurationList";
import { deleteConfiguration } from "./configure/configuration/delete-configuration/deleteConfiguration";
import { dumpConfiguration } from "./configure/configuration/dump-configuration/dumpConfiguration";
import { exportConfiguration } from "./configure/configuration/export-configuration/exportConfiguration";
import { importConfiguration } from "./configure/configuration/import-configuration/importConfiguration";
import { restoreConfiguration } from "./configure/configuration/restore-configuration/restoreConfiguration";
import { addDnsList } from "./configure/dns-and-tac-mode/add-dns-list/addDnsList";
import { getDnsList } from "./configure/dns-and-tac-mode/get-dns-list/getDnsList";
import { getNetwork } from "./configure/dns-and-tac-mode/get-network/getNetwork";
import { saveMode } from "./configure/dns-and-tac-mode/save-mode/saveMode";
import { enableLayer3 } from "./configure/layer-3/enable-layer-3/enableLayer3";
import { getLayer3 } from "./configure/layer-3/get-layer-3/getLayer3";
import { getNats } from "./configure/layer-3/get-nats/getNats";
import { getRoutes } from "./configure/layer-3/get-routes/getRoutes";
import { saveNat } from "./configure/layer-3/save-nat/saveNat";
import { saveRoute } from "./configure/layer-3/save-route/saveRoute";
import { getGatewaySummary } from "./dashboard/get-gateway-summary/getGatewaySummary";
import { statistics } from "./dashboard/statistics/statistics";
import { deleteFilterRule } from "./invisigate-or-controller/filter-rules/delete-filter-rule/deleteFilterRule";
import { disableFilterRule } from "./invisigate-or-controller/filter-rules/disable-filter-rule/disableFilterRule";
import { enableFilterRule } from "./invisigate-or-controller/filter-rules/enable-filter-rule/enableFilterRule";
import { getFilterProtocols } from "./invisigate-or-controller/filter-rules/get-filter-protocols/getFilterProtocols";
import { getFromTrustedFilterRules } from "./invisigate-or-controller/filter-rules/get-from-trusted-filter-rules/getFromTrustedFilterRules";
import { getToTrustedFilterRules } from "./invisigate-or-controller/filter-rules/get-to-trusted-filter-rules/getToTrustedFilterRules";
import { activationConfig } from "./invisigate-or-controller/services/activation-config/activationConfig";
import { config } from "./invisigate-or-controller/services/config/config";
import { dynconfig } from "./invisigate-or-controller/services/dynconfig/dynconfig";
import { gatewayServices } from "./invisigate-or-controller/services/gateway-services/gatewayServices";
import { modService } from "./invisigate-or-controller/services/mod-service/modService";
import { getNetworkTimeProtocols } from "./invisigate-or-controller/services/network-time-protocol/get-network-time-protocols/getNetworkTimeProtocols";
import { pubsubConfig } from "./invisigate-or-controller/services/pub-sub-config/pubsubConfig";
import { remoteKeyAddress } from "./invisigate-or-controller/services/remote-key-address/remoteKeyAddress";
import { setRemoteKeyAddress } from "./invisigate-or-controller/services/remote-key-address/set-remote-key-address/setRemoteKeyAddress";
import { addServerSyslog } from "./invisigate-or-controller/services/remote-syslog/add-server-syslog/addServerSyslog";
import { getSyslogConfig } from "./invisigate-or-controller/services/remote-syslog/get-syslog-config/getSyslogConfig";
import { getSyslogServers } from "./invisigate-or-controller/services/remote-syslog/get-syslog-servers/getSyslogServers";
import { updateSyslogConfig } from "./invisigate-or-controller/services/remote-syslog/update-syslog-config/updateSyslogConfig";
import { setActivationConfig } from "./invisigate-or-controller/services/set-activation-config/setActivationConfig";
import { getDIRFQDN } from "./invisipoint/configure/get-dir-fqdn/getDIRFQDN";
import { getEndpoints } from "./invisipoint/configure/get-endpoints/getEndpoints";
import { fetchLog } from "./invisipoint/log-files/fetch-log/fetchLog";
import { deleteFirmware } from "./invisipoint/manage-firmware/delete-firmware/deleteFirmware";
import { getFirmwareList } from "./invisipoint/manage-firmware/get-firmware-list/getFirmwareList";
import { importFirmware } from "./invisipoint/manage-firmware/import-firmware/importFirmware";
import { getAllTaskStatus } from "./invisipoint/task-status/get-all-task-status/getAllTaskStatus";
import { haltGateway } from "./maintainance/reboot/halt-gateway/haltGateway";
import { rebootGateway } from "./maintainance/reboot/reboot-gateway/rebootGateway";
import { deleteIdentity } from "./manage/identities/delete-identity/deleteIdentity";
import { getIdentities } from "./manage/identities/get-identities/getIdentities";
import { getStageIdAuditList } from "./manage/identities/get-stage-id-audit-list/getStageIdAuditList";
import { importIdentity } from "./manage/identities/import-identity/importIdentity";
import { saveIdentity } from "./manage/identities/save-identity/saveIdentity";
import { deleteResources } from "./manage/protected-resources/delete-resources/deleteResources";
import { getResources } from "./manage/protected-resources/get-resources/getResources";
import { saveResources } from "./manage/protected-resources/save-resources/saveResources";
import { getResourcesList } from "./manage/resources-list/get-resources-list/getResourcesList";
import { saveResourcesList } from "./manage/resources-list/save-resources-list/saveResourcesList";
import { deleteRule } from "./manage/rules/delete-rule/deleteRule";
import { getRules } from "./manage/rules/get-rules/getRules";
import { saveRule } from "./manage/rules/save-rule/saveRule";
import { editTrustLevelGroup } from "./manage/trust-level/edit-trust-level-group/editTrustLevelGroup";
import { getTrustLevelGroups } from "./manage/trust-level/get-trust-level-groups/getTrustLevelGroups";
import { getTrustLevel } from "./manage/trust-level/get-trust-level/getTrustLevel";
import { saveTrustlevel } from "./manage/trust-level/save-trust-level/saveTrustLevel";
import { deleteUnprotectedResource } from "./manage/unprotected-resources/delete-unprotected-resources/deleteUResource";
import { getUnprotectedResources } from "./manage/unprotected-resources/get-unprotected-resources/getUnprotectedResources";
import { saveUnprotectedResources } from "./manage/unprotected-resources/save-unprotected-resources/saveUnprotectedResources";
import { getTaskStatus } from "./invisipoint/configure/get-task-status/getTaskStatus";

const BASE_URL = `${window.location.origin}/${process.env.REACT_APP_BASE_API_PATH}`;

console.log(BASE_URL);

const args = {
  BASE_URL,
};

export const handlers = [
  /* Common */
  /****************************************************************************/
  isBem({ ...args }),
  login({ ...args }),
  logout({ ...args }),
  getNotifications({ ...args }),
  getOpConfig({ ...args }),
  getGatewaysStatus({ ...args }),
  getCurrentGatewayStatus({ ...args }),
  /****************************************************************************/

  /* Dashboard */
  /****************************************************************************/
  getGatewaySummary({ ...args }),
  statistics({ ...args }),
  /****************************************************************************/

  /* Manage */
  /****************************************************************************/
  /* Manage > Identities */
  getIdentities({ ...args }),
  deleteIdentity({ ...args }),
  getStageIdAuditList({ ...args }),
  importIdentity({ ...args }),
  saveIdentity({ ...args }),
  /* Manage > Protected Resources */
  deleteResources({ ...args }),
  getResources({ ...args }),
  saveResources({ ...args }),
  /* Manage > Resource Lists */
  getResourcesList({ ...args }),
  saveResourcesList({ ...args }),
  /* Manage > UnProtected Resources */
  deleteUnprotectedResource({ ...args }),
  getUnprotectedResources({ ...args }),
  saveUnprotectedResources({ ...args }),
  /* Manage > Rules */
  deleteRule({ ...args }),
  getRules({ ...args }),
  saveRule({ ...args }),
  /* Manage > Trust Level */
  editTrustLevelGroup({ ...args }),
  getTrustLevel({ ...args }),
  getTrustLevelGroups({ ...args }),
  saveTrustlevel({ ...args }),
  /****************************************************************************/

  /* Configure */
  /****************************************************************************/
  /* Configure > Applications */
  deleteApplication({ ...args }),
  getApplications({ ...args }),
  getPorts({ ...args }),
  saveApplication({ ...args }),
  /* Configure > DNS and TAC Mode */
  addDnsList({ ...args }),
  getDnsList({ ...args }),
  getNetwork({ ...args }),
  saveMode({ ...args }),
  /* Configure > Layer3 */
  enableLayer3({ ...args }),
  getLayer3({ ...args }),
  getNats({ ...args }),
  getRoutes({ ...args }),
  saveNat({ ...args }),
  saveRoute({ ...args }),
  /* Configure > Configuration */
  configurationList({ ...args }),
  deleteConfiguration({ ...args }),
  dumpConfiguration({ ...args }),
  exportConfiguration({ ...args }),
  importConfiguration({ ...args }),
  restoreConfiguration({ ...args }),
  /* Configure > Configuration Logs */
  getConfigurationLogs({ ...args }),
  /****************************************************************************/

  /* InvisiGate or Controller */
  /****************************************************************************/
  /* InvisiGate or Controller > Services */
  activationConfig({ ...args }),
  config({ ...args }),
  dynconfig({ ...args }),
  gatewayServices({ ...args }),
  modService({ ...args }),
  getNetworkTimeProtocols({ ...args }),
  pubsubConfig({ ...args }),
  remoteKeyAddress({ ...args }),
  setRemoteKeyAddress({ ...args }),
  addServerSyslog({ ...args }),
  getSyslogConfig({ ...args }),
  getSyslogServers({ ...args }),
  updateSyslogConfig({ ...args }),
  setActivationConfig({ ...args }),
  /* InvisiGate or Controller > Filter Rules */
  deleteFilterRule({ ...args }),
  disableFilterRule({ ...args }),
  enableFilterRule({ ...args }),
  getFilterProtocols({ ...args }),
  getFromTrustedFilterRules({ ...args }),
  getToTrustedFilterRules({ ...args }),
  /****************************************************************************/

  /* Invisipoint */
  // TODO: Missing API's
  /****************************************************************************/
  /* Invisipoint > Configure */
  getDIRFQDN({ ...args }),
  getEndpoints({ ...args }),
  getTaskStatus({ ...args }),
  /* Invisipoint > Task Status */
  getAllTaskStatus({ ...args }),
  /* Invisipoint > Manage Firmware */
  deleteFirmware({ ...args }),
  getFirmwareList({ ...args }),
  importFirmware({ ...args }),
  /* Invisipoint > Log Files */
  fetchLog({ ...args }),
  /****************************************************************************/

  /* Maintainance */
  /****************************************************************************/
  /* Maintainance > Reboot */
  haltGateway({ ...args }),
  rebootGateway({ ...args }),
  /****************************************************************************/
];

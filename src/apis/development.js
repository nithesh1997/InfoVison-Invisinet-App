export const development = {
  // Key is the environment value.
  hosts: {
    __default: {
      // Required, to be used when alternate host is not specified in API call.
      https: false, // Required, can be `true` or `false`.
      hostname: window.location.hostname, // Required, must be a string and a domain/subdomain without any other info like port, slashes, etc.
      port: window.location.port, // Required, must be a number.
      "default-method": "GET", // Required, to be used when alternate method is not specified in API call.
    },
    "ba-sign-in-dev": {
      https: false,
      hostname: window.location.hostname,
      port: window.location.port,
      "default-method": "GET",
    },
    "ba-api-dev": {
      https: false,
      hostname: window.location.hostname,
      port: window.location.port,
      "default-method": "GET",
    },
  },
  keywords: {
    // Keywords can be used in headers, params and body.
    // Keys can have alphabets, numbers, hyphen and underscore. Values must be a string.
  },
  headers: {
    "__default::GET": {
      // Key-name should be host::method, Value must be an object.
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
    "ba-fb-dev::GET": {
      "Content-Type": "application/json",
      Accept: "text/plain, application/json",
    },
  },
  paths: {
    "sign-in": {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-sign-in-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/login", // Required, must be a string starting with "/" and not ending with "/".
      params: {
        // Optional, when provided all values will be appended to pathname as query parameters.
        address: "ec2-44-236-115-21.us-west-2.compute.amazonaws.com", // All values must be parsed to check if any of them have a string with substring/s matching REGEX: `\{\{kw::[a-zA-Z-0-9_]+\}\}`. If there are they must be replace with actual values of those keywords.
      },
      headers: {
        "Content-Type": "application/json",
      },
    },
    isBem: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/isBem", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {},
    },
    "trust-levels": {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getTrustlevels", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    identities: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getIdentities", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getIdentitiesv2: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getIdentitiesv2", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    endpoints: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getEndpoints", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getFQDN: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getDirFQDN",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    rules: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getRules", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "delete-rule": {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/deleteRule", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "save-identity": {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/saveIdentity", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "delete-identity": {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/deleteIdentity", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "save-rule": {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/saveRule", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getApps: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getApps", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getPorts: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getPorts", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    resources: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getResources", // Required, must be a string starting with "/" and not ending with "/".
      params: { gatewayIP: "192.168.40.50" },
      headers: {
        "Content-Type": "application/json",
      },
    },
    resourcelist: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getResourceLists", // Required, must be a string starting with "/" and not ending with "/".
      params: { gatewayIP: "192.168.40.50" },
      headers: {
        "Content-Type": "application/json",
      },
    },
    summary: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getGatewaySummary", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    tokens: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/statistics", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    gatewayList: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getGatewayList", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getRoutes: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getRoutes", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    uresources: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getUResources", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    network: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getNetwork", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    networkTwo: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/saveMode", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    layer3: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getLayer3", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:4000",
        // "Access-Control-Allow-Origin": "*",
      },
    },
    bridge: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getGatewayDetails", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:4000",
        // "Access-Control-Allow-Origin": "*",
      },
    },
    enableLayer3: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/enableLayer3",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    disableLayer3: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/disableLayer3",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    dnsList: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getdnsList", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    addDnsList: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/addDnsList", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getTrustLevel: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getTrustLevel", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:8000",
      },
    },
    saveTrustLevel: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/saveTLevel", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:8000",
      },
    },
    saveTrustLevelGrp: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/editTrustLevelGroup", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:8000",
      },
    },
    getNats: {
      method: "GET", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/getNats", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteNats: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/deleteNat", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {},
    },
    saveNats: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Option,al "__default" host will be used if not provided.
      pathname: "/skylightweb/saveNat", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    filterProtocols: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getFilterProtocols",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    toTrustedfilter: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getToTrustedFilter",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    fromTrustedfilter: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getFromTrustedFilter",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    addFirmware: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/addFirmwareTask", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "add-gateway": {
      method: "POST",
      host: "ba-sign-in-dev",
      pathname: "/skylightweb/saveGateway",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "import-file": {
      method: "POST",
      host: "ba-sign-in-dev",
      pathname: "/skylightweb/importFirmware",
      params: {},
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    deleteGateway: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteGateway",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    addRoutes: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/saveRoute", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteRoutes: {
      method: "POST", // Optional, "default-method" key of host will be used if not provided.
      host: "ba-api-dev", // Optional, "__default" host will be used if not provided.
      pathname: "/skylightweb/deleteRoute", // Required, must be a string starting with "/" and not ending with "/".
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    distributedIdentities: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/dynconfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    gatewayServies: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/gatewayServices",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getGatewayServiceByName: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getGatewayServiceByName",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    activationConfig: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/activationConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    rksaddress: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/rksaddress",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    logout: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/logout",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    addToDoList: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/addToDoList",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    epcLogs: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getEpcLogs",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteFilter: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteFilterRule",
      params: {},
      headers: { "Content-Type": "application/json" },
    },
    saveFilterRule: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveFilterRule",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    saveOldFilterRule: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveOldFilterRule",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    haltGateway: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/haltGateway",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    rebootGateway: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/rebootGateway",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getFirmware: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getFirmwareList",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteFirmware: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteFirmware",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "get-task-status": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getTaskStatus",
      params: {},
      headers: {},
    },
    getEPCFRTemplate: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getEPCFRTemplates",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "add-configure-filter-rules-task": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveEPCFilterRules",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteEPCFilterRules: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteEPCFilterRules",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "set-remote-key-address": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/setRemoteKeyAddress",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    setActivationService: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/setActivationService",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "set-trusted-data": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/setActivationConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "set-distributed-identities": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/dynconfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "set-radio-state": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/modService",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "add-endpoint": {
      method: "POST",
      host: "ba-sign-in-dev",
      pathname: "/skylightweb/addEndpoint",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "edit-endpoint": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/editEndpoint",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "delete-endpoint": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteEndpoint",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "save-resource": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveResource",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "delete-resource": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteResource",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "save-resList": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveResourceList",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "modify-resource-list": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/editResourceList",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "delete-resList": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteResourceList",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "save-uresource": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveUResource",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "delete-uresource": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteUResource",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "trust-groups": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getTrustLevelGroups",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    "save-app": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveApps",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "delete-app": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteApp",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "fetch-log": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/fetchLog",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    "download-log": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/downloadLogs",
      params: {},
      headers: {},
    },
    EPCFilterRules: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getEPCFilterRules",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    EPCFilterRulesStage: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getEPCFilterRulesStage",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    enableFilterRule: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/enableFilterRule",
      params: {},
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
    disableFilterRule: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/disableFilterRule",
      params: {},
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    },
    addnotification: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/notification",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getnotifications: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getnotifications",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deletenotification: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deletenotification",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    updatenotifications: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/updatenotifications",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getallnotifications: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getallnotifications",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deleteFetch: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deletefetchlog",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    getAllTaskStatus: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getAllTaskStatus",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    deletetask: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deletetask",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    getGateways: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getGateways",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getGatewaysStatus: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getGatewaysStatus",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getNTPs: {
      method: "GET",
      host: "ba-sign-in-dev",
      pathname: "/skylightweb/getNPTs",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    getCurrentGatewayStatus: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getCurrentGatewayStatus",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getSyslogServer: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getSyslogServers",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getSyslogConfig: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getSyslogConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    pubsubApi: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/pubsub/config",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    savePubSub: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/pubsub/config",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    addSyslog: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/addSyslogServer",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    deleteSyslog: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteSyslogServer",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    updateSyslogConfig: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/updateSyslogConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getCurrentGatewayConfig: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getOpConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    enableudp: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/enableudp",
      params: {},
      headers: { "Content-Type": "application/json" },
    },
    removedatagramtoken: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/removedatagramtoken",
      params: {},
      headers: { "Content-Type": "application/json" },
    },
    importIdentity: {
      method: "POST",
      host: "ba-sign-in-dev",
      pathname: "/skylightweb/importIdentity",
      params: {},
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    getStgIdAuditList: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getStgIdAuditList",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    getStagingIdentityList: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/getStagingIdentityList",
      params: {},
      headers: {
        "Content-Type": "application/json",
      },
    },
    dumpConfigFile: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/dumpConfigFile",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    saveGatewayConfig: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveGatewayConfig",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    deleteGatewayConfig: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteGatewayConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    viewConfigLogs: {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/viewConfigLogs",
      params: {},
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    },
    deleteGatewayConfigLogs: {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteGatewayConfigLogs",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    /* ---------------------- configuration management ---------------------- */
    "config-list": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/configList",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "config-logs": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/configLogs",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "export-config": {
      method: "GET",
      host: "ba-api-dev",
      pathname: "/skylightweb/exportConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "dump-config": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/dumpConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "restore-config": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/restoreConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "import-config": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/importConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "delete-config": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/deleteConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    "save-config": {
      method: "POST",
      host: "ba-api-dev",
      pathname: "/skylightweb/saveConfig",
      params: {},
      headers: { "Content-Type": "application/json", Accept: "*/*" },
    },
    /* ---------------------- configuration management ---------------------- */
  },
};

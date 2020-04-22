import React from "react";

import { Route, Param, Workspace, ParamType } from "./types";
import Helpers from "./lib/helpers";

const workspaces: Workspace[] = [];

export default React.createContext({
  workspace: Helpers.getDefaultWorkspace(),
  workspaces,
  setWorkspaceName: (name: string) => {},
  environment: null,
  darkMode: null,
  setDarkMode: (darkMode: boolean) => {},
  setEnvVar: (payload: { key: string; value: any }) => {},
  deleteEnvVar: (payload: { key: string }) => {},
  routeConfig: {},
  getParam: (filters: {
    route: Route;
    param: Param;
    paramType: ParamType;
    parent?: string;
  }) => "",
  setParam: (payload: {
    route: Route;
    param: Param;
    value: any;
    paramType: ParamType;
    parent?: string;
  }) => {},
  setHeader: (payload: { route: Route; key: string; value: string }) => {},
  setApiResponse: (payload: {
    route: Route;
    response: any;
    error: any;
    loading: boolean;
  }) => {},
  getWorkspaceSearchKeywords: () => "",
  setWorkspaceSearchKeywords: (keywords: string) => {},
  exportModalShowing: false,
  setExportModalShowing: (showing: boolean) => {},
});

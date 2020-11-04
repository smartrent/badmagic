import React, { useContext } from "react";

import { Route, Param, Workspace, ParamType } from "../types";
import Helpers from "../lib/helpers";

const workspaces: Workspace[] = [];

const Context = React.createContext({
  workspace: Helpers.getDefaultWorkspace(),
  workspaces,
  setWorkspaceName: (name: string) => {},
  environment: null,
  darkMode: true,
  setDarkMode: (darkMode: boolean) => {},
  setEnvVar: (payload: { key: string; value: any }) => {},
  deleteEnvVar: (payload: { key: string }) => {},
  routeConfig: {},
  getParam: (filters: {
    route: Route;
    param: Param;
    paramType: ParamType;
    parent: null | string;
  }) => "",
  setParam: (payload: {
    route: Route;
    param: Param;
    value: any;
    paramType: ParamType;
    parent: null | string;
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
});

export default Context;
export const useGlobalContext = () => useContext(Context);

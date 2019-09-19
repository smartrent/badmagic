import React from "react";

import { Route, Param, Workspace, ParamType } from "./types";
import Helpers from "./lib/helpers";

const workspaces: Workspace[] = [];

export default React.createContext({
  workspace: Helpers.getDefaultWorkspace(),
  workspaces,
  setWorkspaceName: (name: string) => {},
  environment: null,
  setEnvVar: (payload: { key: string; value: any }) => {},
  deleteEnvVar: (payload: { key: string }) => {},
  routeConfig: {},
  getParam: (filters: { route: Route; param: Param; paramType: ParamType }) =>
    "",
  setParam: (payload: {
    route: Route;
    param: Param;
    value: any;
    paramType: ParamType;
  }) => {},
  setHeader: (payload: { route: Route; key: string; value: string }) => {},
  setApiResponse: (payload: {
    route: Route;
    response: any;
    error: any;
    loading: boolean;
  }) => {},
});

import React from "react";

import { Route, UrlParam, BodyParam, Workspace, QSParam } from "./types";
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
  setUrlParam: (payload: {
    route: Route;
    urlParam: UrlParam;
    value: any;
  }) => {},
  getUrlParam: (filters: { route: Route; urlParam: UrlParam }) => "",
  setQSParam: (payload: { route: Route; param: QSParam; value: any }) => {},
  getQSParam: (filters: { route: Route; param: QSParam }) => "",
  setBody: (payload: { route: Route; param: BodyParam; value: any }) => {},
  setHeader: (payload: { route: Route; key: string; value: string }) => {},
  getBody: (filters: { route: Route; param: BodyParam }) => "",
  setApiResponse: (payload: {
    route: Route;
    response: any;
    error: any;
    loading: boolean;
  }) => {},
});

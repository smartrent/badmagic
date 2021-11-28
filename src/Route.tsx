import React from "react";


import { RequestResponse } from "./common/route/RequestResponse";
import { Documentation } from "./common/route/Documentation";

import { History } from "./common/History";

import {
  Route,
  ApplyAxiosInterceptors,
  WorkspaceConfig,
  AuthForm,
  HistoryMetadata
} from "./types";

export default function Route({
  route,
  applyAxiosInterceptors,
  AuthForm,
  HistoryMetadata
  workspaceConfig,
}: {
  route: Route;
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
  AuthForm: undefined | AuthForm;
  HistoryMetadata: undefined | HistoryMetadata;
  workspaceConfig: null | WorkspaceConfig;
}) {
  return (
    <>
      {AuthForm && workspaceConfig ? (
        <AuthForm workspaceConfig={workspaceConfig} />
      ) : null}
      <RequestResponse
        route={route}
        applyAxiosInterceptors={applyAxiosInterceptors}
      />
      <History activeRoute={route} HistoryMetadata={HistoryMetadata} />
      <Documentation documentation={route.documentation} />
    </>
  );
}

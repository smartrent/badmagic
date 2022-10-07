import React, { useMemo } from "react";

import { useGlobalContext } from "./context/GlobalContext";
import { RequestResponse } from "./common/route/RequestResponse";
import { Documentation } from "./common/route/Documentation";

import { History } from "./common/History";

import {
  Route,
  ApplyAxiosInterceptors,
  WorkspaceConfig,
  AuthForm,
  HistoryMetadata,
} from "./types";
import Helpers from "./lib/helpers";

export default function Route({
  route,
  applyAxiosInterceptors,
  AuthForm,
  HistoryMetadata,
  workspaceConfig,
}: {
  route: Route;
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
  AuthForm?: AuthForm;
  HistoryMetadata?: HistoryMetadata;
  workspaceConfig: WorkspaceConfig;
}) {
  const { historicResponses } = useGlobalContext();

  const filteredHistory = useMemo(
    () => Helpers.filterHistory(historicResponses, route),
    [historicResponses, route]
  );

  return (
    <>
      {AuthForm && workspaceConfig ? (
        <AuthForm workspaceConfig={workspaceConfig} />
      ) : null}
      <RequestResponse
        route={route}
        applyAxiosInterceptors={applyAxiosInterceptors}
      />
      <History
        filteredHistory={filteredHistory}
        HistoryMetadata={HistoryMetadata}
      />
      <Documentation documentation={route.documentation} />
    </>
  );
}

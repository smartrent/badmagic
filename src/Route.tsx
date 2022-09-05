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
  HistoricResponse,
} from "./types";

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

  // If `activeRoute` is specified, filter displayed History to records matching just that route
  const filteredHistory = useMemo(() => {
    return !route
      ? historicResponses
      : historicResponses.filter(
          (historicResponse: HistoricResponse) =>
            historicResponse?.route?.path === route.path
        );
  }, [historicResponses, route]);

  return (
    <>
      {AuthForm && workspaceConfig ? (
        <AuthForm workspaceConfig={workspaceConfig} />
      ) : null}
      <RequestResponse
        filteredHistory={filteredHistory}
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

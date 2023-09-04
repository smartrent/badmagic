import { DeepLink, HistoricResponse, Route, Workspace } from "../types";
import { useCallback, useState } from "react";
import { useActiveResponse } from "./activeResponse";

export function useCopyCurrentRoute({
  activeRoute,
}: {
  activeRoute: Route | null;
}) {
  const [copied, setCopied] = useState(false);
  const activeResponse: HistoricResponse = useActiveResponse(
    activeRoute || { name: "", path: "" }
  );

  const copy = useCallback(async () => {
    const url = buildCurrentRouteUrl(activeResponse);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      window.alert(url);
    }
  }, [activeResponse]);

  return { copy, copied };
}

export function getLinkedRouteFromUrl({
  workspaces,
}: {
  workspaces: Workspace[];
}) {
  let route: Route | null = null;
  let historicResponse: HistoricResponse | null = null;

  const linkedRequest = new URLSearchParams(window.location.search).get(
    "request"
  );

  if (linkedRequest) {
    const { name, path, ...response } = JSON.parse(
      window.atob(linkedRequest)
    ) as DeepLink;

    for (const workspace of workspaces) {
      if (route) break;
      for (const candidateRoute of workspace.routes) {
        if (candidateRoute.name === name && candidateRoute.path === path) {
          route = candidateRoute;
          break;
        }
      }
    }

    if (route) {
      historicResponse = {
        route,
        response: null,
        error: null,
        metadata: {},
        ...response,
      };
    }
  }

  return { route, historicResponse };
}

function buildCurrentRouteUrl(activeResponse: HistoricResponse): string {
  const request: DeepLink = {
    name: activeResponse.route.name,
    path: activeResponse.route.path,
    urlParams: activeResponse.urlParams,
    qsParams: activeResponse.qsParams,
    body: activeResponse.body,
  };

  return `${window.location.href.split("?")[0]}?request=${window.btoa(
    JSON.stringify(request)
  )}`;
}

import { DeepLink, HistoricResponse, Route, Workspace } from "../types";
import { useCallback, useState } from "react";
import { useActiveResponse } from "./activeResponse";

export function useCopyCurrentRoute({
  activeRoute,
  urlParams,
  qsParams,
}: {
  activeRoute: Route | null;
  urlParams?: Record<string, unknown>;
  qsParams?: Record<string, unknown>;
}) {
  const [copied, setCopied] = useState(false);
  const activeResponse: HistoricResponse = useActiveResponse(
    activeRoute || { name: "", path: "" }
  );

  const copy = useCallback(async () => {
    const url = buildCurrentRouteUrl({
      ...activeResponse,
      urlParams: urlParams ?? activeResponse.urlParams,
      qsParams: qsParams ?? activeResponse.qsParams,
    });

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      window.alert(url);
    }
  }, [activeResponse, urlParams, qsParams]);

  return { copy, copied };
}

export function getLinkedRouteFromUrl({
  workspaces,
}: {
  workspaces: Workspace[];
}) {
  let route: Route | null = null;
  let historicResponse: HistoricResponse | null = null;

  const linkedRequest = safeParseUrl(
    new URLSearchParams(window.location.search).get("request") || ""
  );

  if (linkedRequest) {
    const { name, path, ...response } = linkedRequest;
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

function safeParseUrl(request: string): DeepLink | null {
  try {
    const result = JSON.parse(window.atob(request));

    if (result.name && result.path) {
      return result;
    }
  } catch {
    //
  }
  return null;
}

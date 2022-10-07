import { useGlobalContext } from "../context/GlobalContext";
import helpers from "../lib/helpers";
import { HistoricResponse, Route } from "../types";
import { cloneDeep, first } from "lodash-es";
import { useCallback, useMemo } from "react";

export function useCopyCurrentRoute({
  activeRoute,
}: {
  activeRoute: Route | null;
}) {
  const { partialRequestResponses, historicResponses } = useGlobalContext();

  const filteredHistory = useMemo(() => {
    return !activeRoute
      ? historicResponses
      : historicResponses.filter(
          (historicResponse: HistoricResponse) =>
            historicResponse?.route?.path === activeRoute.path
        );
  }, [historicResponses, activeRoute]);

  const activeResponse: HistoricResponse = useMemo(() => {
    // Prefers in-memory state changes that already began since the session started
    // Falls back to loading the last HistoricResponse from history if set
    // Falls back to a new partial HistoricRepsonse if the first two conditions aren't met.
    if (activeRoute && partialRequestResponses[activeRoute.path]) {
      return partialRequestResponses[activeRoute.path];
    } else if (filteredHistory.length) {
      return cloneDeep(first(filteredHistory)) as HistoricResponse;
    }

    return {
      metadata: {},
      response: null,
      error: null,
      urlParams: {},
      qsParams: helpers.reduceDefaultParamValues(activeRoute?.qsParams),
      body: helpers.reduceDefaultParamValues(activeRoute?.body),
      route: activeRoute!,
    };
  }, [activeRoute, filteredHistory, partialRequestResponses]);

  const copy = useCallback(async () => {
    const request = JSON.stringify({
      route: activeResponse.route,
      response: activeResponse,
    });

    const url = `${window.location.origin}?request=${window.btoa(request)}`;

    return navigator.clipboard.writeText(url);
  }, [activeResponse, activeRoute?.workspaceName]);

  return { copy };
}

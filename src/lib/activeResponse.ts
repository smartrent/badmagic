import { cloneDeep, first } from "lodash-es";
import { useMemo } from "react";
import { Helpers } from "..";
import { useGlobalContext } from "../context/GlobalContext";
import { HistoricResponse, Route } from "../types";

export function useActiveResponse(activeRoute: Route): HistoricResponse {
  const { historicResponses, partialRequestResponses } = useGlobalContext();

  const filteredHistory = useMemo(
    () => Helpers.filterHistory(historicResponses, activeRoute),
    [historicResponses, activeRoute]
  );

  return useMemo(() => {
    // Prefers in-memory state changes that already began since the session started
    // Falls back to loading the last HistoricResponse from history if set
    // Falls back to a new partial HistoricRepsonse if the first two conditions aren't met.
    if (partialRequestResponses[activeRoute.path]) {
      return partialRequestResponses[activeRoute.path];
    } else if (filteredHistory.length) {
      return cloneDeep(first(filteredHistory)) as HistoricResponse;
    }

    return {
      metadata: {},
      response: null,
      error: null,
      urlParams: {},
      qsParams: Helpers.reduceDefaultParamValues(activeRoute?.qsParams),
      body: Helpers.reduceDefaultParamValues(activeRoute?.body),
      route: activeRoute,
    };
  }, [activeRoute, filteredHistory, partialRequestResponses]);
}

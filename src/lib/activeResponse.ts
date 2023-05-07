import { cloneDeep, first } from "lodash-es";
import { useMemo } from "react";
import { Helpers } from "..";
import { useGlobalContext } from "../context/GlobalContext";
import { HistoricResponse, Route } from "../types";

export function useActiveResponse(route: Route): HistoricResponse {
  const { historicResponses, partialRequestResponses } = useGlobalContext();

  const filteredHistory = useMemo(
    () => Helpers.filterHistory(historicResponses, route),
    [historicResponses, route]
  );

  return useMemo(() => {
    // Prefers in-memory state changes that already began since the session started
    // Falls back to loading the last HistoricResponse from history if set
    // Falls back to a new partial HistoricResponse if the first two conditions aren't met.
    if (partialRequestResponses[route.path]) {
      return partialRequestResponses[route.path];
    } else if (filteredHistory.length) {
      return cloneDeep(first(filteredHistory)) as HistoricResponse;
    }

    return {
      metadata: {
        insertedAt: new Date(),
      },
      response: null,
      error: null,
      urlParams: {},
      qsParams: Helpers.reduceDefaultParamValues(route?.qsParams),
      body: Helpers.reduceDefaultParamValues(route?.body),
      route: route,
    };
  }, [route, filteredHistory, partialRequestResponses]);
}

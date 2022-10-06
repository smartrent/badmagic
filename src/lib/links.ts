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
    const data = {
      workspaceName: activeRoute?.workspaceName,
      route: activeResponse.route,
      urlParams: activeResponse.urlParams,
      qsParams: activeResponse.qsParams,
      body: activeResponse.body,
    };

    const hash = await convertRecordToHexString(data);
    const url = `${window.location}?request=${hash}`;

    return navigator.clipboard.writeText(url);
  }, [activeResponse, activeRoute?.workspaceName]);

  return { copy };
}

async function convertRecordToHexString(data: Record<string, unknown>) {
  const buffer = Buffer.from(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

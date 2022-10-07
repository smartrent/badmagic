import { useGlobalContext } from "../context/GlobalContext";
import { HistoricResponse, Route } from "../types";
import { useCallback } from "react";
import { useActiveResponse } from "./activeResponse";

export function useCopyCurrentRoute({
  activeRoute,
}: {
  activeRoute: Route | null;
}) {
  const activeResponse: HistoricResponse = useActiveResponse(
    activeRoute || { name: "", path: "" }
  );

  const getUrl = useCallback(() => {
    const request = JSON.stringify({
      route: activeResponse.route,
      response: activeResponse,
    });

    return `${window.location.href.split('?')[0]}?request=${window.btoa(request)}`;
  }, [activeResponse]);

  const copy = useCallback(() => navigator.clipboard.writeText(getUrl()), [
    getUrl,
  ]);

  return { copy, getUrl };
}

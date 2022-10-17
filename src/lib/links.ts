import { DeepLink, HistoricResponse, Route } from "../types";
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
    const url = getUrl(activeResponse);

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

function getUrl(activeResponse: HistoricResponse): string {
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

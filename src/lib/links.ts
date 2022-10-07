import { useGlobalContext } from "../context/GlobalContext";
import { HistoricResponse, Route } from "../types";
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

  const getUrl = useCallback(() => {
    const request = JSON.stringify({
      route: activeResponse.route,
      response: activeResponse,
    });

    return `${window.location.href.split("?")[0]}?request=${window.btoa(
      request
    )}`;
  }, [activeResponse]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1000);
    } catch {
      window.alert(getUrl());
    }
  }, [getUrl]);

  return { copy, copied };
}

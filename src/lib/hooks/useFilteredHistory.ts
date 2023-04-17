import { useMemo } from "react";

import { useGlobalContext } from "../../context/GlobalContext";
import { useActiveRoute } from "./useActiveRoute";

export function useFilteredHistory() {
  const { historicResponses } = useGlobalContext();
  const activeRoute = useActiveRoute();

  return useMemo(() => {
    return !activeRoute
      ? historicResponses
      : historicResponses.filter(
          (historicResponse) =>
            historicResponse?.route?.path === activeRoute.path
        );
  }, [historicResponses, activeRoute]);
}

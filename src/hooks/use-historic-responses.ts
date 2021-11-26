import { useState, useEffect, useCallback } from "react";

import storage from "../lib/storage";

import { HistoricResponse, StoreHistoricResponse, Route } from "../types";

/**
 * Engineers can opt to use `axios.interceptors.response.use` to intercept an AxiosResponse or AxiosError and choose
 * to store them in local storage so that the History section shows up in BadMagic and end-users can see old requests
 * along with optional metadata associated with those requests.
 */
export function useHistoricResponses({
  route,
}: {
  route: Route;
}): [HistoricResponse[], StoreHistoricResponse] {
  const storageKey = "historic-responses";

  const [historicResponses, setHistoricResponseInState] = useState<
    HistoricResponse[]
  >([]);

  // On initial mount, this will fetch HistoricResponse from local storage once
  useEffect(() => {
    const historicResponsesFromStorage: HistoricResponse[] = storage.get(
      storageKey
    );

    if (historicResponsesFromStorage?.length) {
      setHistoricResponseInState(historicResponsesFromStorage);
    }
  }, []);

  const storeHistoricResponse = useCallback(
    (historicResponse: HistoricResponse) => {
      const newHistoricResponses = [
        {
          ...historicResponse,
          route,
          metadata: {
            ...(historicResponse?.metadata || {}),
            insertedAt: new Date(),
          },
        },
        ...historicResponses,
      ].slice(0, 49); // prepend the new HistoricResponse, and ensure the array has a max of 50 cells

      storage.set(storageKey, newHistoricResponses);
      setHistoricResponseInState(newHistoricResponses);
    },
    [historicResponses, , route]
  );

  // Note: usually `useState` has a pattern of `[values, setValues]` but here are returning
  // `[historicResponse, storeHistoricResponse]` where `storeHistoricResponse` prepends the HistoricResponse to the array
  // and handles limiting the array size to 50 cell.
  return [historicResponses, storeHistoricResponse];
}

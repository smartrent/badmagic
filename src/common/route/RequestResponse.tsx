import React, { useCallback, useMemo } from "react";
import useAxios from "@smartrent/use-axios";
import axios from "axios";

import { useGlobalContext } from "../../context/GlobalContext";

import { Response } from "./Response";
import { Request } from "./Request";
import { TopBar } from "./TopBar";

import helpers from "../../lib/helpers";

import {
  Route,
  Method,
  ApplyAxiosInterceptors,
  HistoricResponse,
} from "../../types";
import { useActiveResponse } from "../../lib/activeResponse";

export function RequestResponse({
  route,
  applyAxiosInterceptors,
}: {
  route: Route;
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
}) {
  const { darkMode, storeHistoricResponse, setPartialRequestResponse } =
    useGlobalContext();

  const requestResponse: HistoricResponse = useActiveResponse(route, true);

  const setUrlParams = useCallback(
    (urlParams: Record<string, any>) => {
      setPartialRequestResponse({ ...requestResponse, urlParams });
    },
    [requestResponse, setPartialRequestResponse]
  );

  const setQsParams = useCallback(
    (qsParams: Record<string, any>) => {
      setPartialRequestResponse({ ...requestResponse, qsParams });
    },
    [requestResponse, setPartialRequestResponse]
  );

  const setBody = useCallback(
    (body: Record<string, any>) => {
      setPartialRequestResponse({ ...requestResponse, body });
    },
    [requestResponse, setPartialRequestResponse]
  );

  // A useCallback function that includes `route` in the HistoricResponse
  const storeHistoricResponseWithRoute = useCallback(
    (payload: Omit<HistoricResponse, "route">) => {
      return storeHistoricResponse({ ...requestResponse, ...payload, route });
    },
    [storeHistoricResponse, route, requestResponse]
  );

  const method: string | Method = useMemo(() => route.method || "GET", [route]);

  const url = useMemo(() => {
    return helpers.buildUrl({
      route,
      urlParams: (requestResponse as HistoricResponse).urlParams,
      qsParams: (requestResponse as HistoricResponse).qsParams,
    });
  }, [route, requestResponse]);

  // The end-user can optionally load Axios Interceptors at this point. https://axios-http.com/docs/interceptors
  const axiosInstance = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: route?.baseUrl,
      headers: {}, // by default no headers are set. If you need to pass headers, use `useAxiosMiddleware`
    });
    return applyAxiosInterceptors
      ? applyAxiosInterceptors({
          axios: axiosInstance,
          storeHistoricResponse: storeHistoricResponseWithRoute,
        })
      : axiosInstance;
  }, [applyAxiosInterceptors, route?.baseUrl, storeHistoricResponseWithRoute]);

  const { response, loading, error, reFetch } = useAxios({
    axios: axiosInstance,
    method: method as Method,
    url,
    options: {
      data: route.body ? requestResponse.body : null, // Don't send data if `body` is not specified by the `route` definition
    },
  });

  // When a Reset button is clicked, it resets all Params
  const resetAllParams = useCallback(() => {
    setPartialRequestResponse({
      ...requestResponse,
      qsParams: {},
      urlParams: {},
      body: {},
      error: null,
      response: null,
    });
  }, [requestResponse, setPartialRequestResponse]);

  const styles = useMemo(() => {
    return {
      container: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
    };
  }, [darkMode]);

  // When the route changes or the response changes, regenerate ResponseDOM
  const responseDOM = useMemo(() => {
    // If we have a recent Axios request, display that instead of the historic data.
    // Note: We want a visual indicator that something is happening when loading
    if (loading || response || error || !requestResponse) {
      return (
        <Response
          response={loading ? null : response}
          body={requestResponse?.body}
          error={loading ? null : error}
        />
      );
    }

    // fallback to the last historic record if the user is returning to this screen and hasn't made a request yet
    return (
      <Response
        response={requestResponse?.response}
        body={requestResponse?.body}
        error={requestResponse?.error}
      />
    );
  }, [response, error, requestResponse, loading]);

  return (
    <div
      className={`overflow-hidden p-4 border rounded overflow-x-hidden mb-4 ${styles.container}`}
    >
      <TopBar
        route={route}
        qsParams={requestResponse?.qsParams}
        urlParams={requestResponse?.urlParams}
      />
      <div className="flex py-2">
        <Request
          route={route}
          resetAllParams={resetAllParams}
          loading={loading}
          requestResponse={requestResponse}
          reFetch={reFetch}
          setUrlParams={setUrlParams}
          setBody={setBody}
          setQsParams={setQsParams}
        />
        {responseDOM}
      </div>
    </div>
  );
}

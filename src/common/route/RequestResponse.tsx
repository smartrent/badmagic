import React, { useState, useCallback, useMemo } from "react";
import useAxios from "@smartrent/use-axios";
import axios, { AxiosResponse, AxiosError } from "axios";

import { useGlobalContext } from "../../context/GlobalContext";

import { Response } from "./Response";
import { Request } from "./Request";
import { TopBar } from "./TopBar";

import Helpers from "../../lib/helpers";
import {
  Route,
  Method,
  ApplyAxiosInterceptors,
  StoreHistoricResponsePayload,
} from "../../types";

export function RequestResponse({
  route,
  applyAxiosInterceptors,
}: {
  route: Route;
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
}) {
  const { darkMode, storeHistoricResponse } = useGlobalContext();
  const [urlParams, setUrlParams] = useState({});
  const [qsParams, setQsParams] = useState({});
  const [body, setBody] = useState({});

  const method: Method = useMemo(() => {
    return route.method ? route.method : Method.GET;
  }, [route]);

  const url = useMemo(() => {
    return Helpers.buildUrl({
      route,
      urlParams,
      qsParams: qsParams || {},
    });
  }, [route, urlParams, qsParams]);

  // A useCallback function that includes `route` in the HistoricResponse
  const storeHistoricResponseWithRoute = useCallback(
    (payload: Omit<StoreHistoricResponsePayload, "route">) => {
      storeHistoricResponse({ ...payload, route, qsParams, body, urlParams });
    },
    [storeHistoricResponse, route, qsParams, body, urlParams]
  );

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
  }, [route, storeHistoricResponseWithRoute]);

  // @ts-ignore
  const {
    response,
    loading,
    error,
    reFetch,
  }: {
    response: null | AxiosResponse;
    loading: boolean;
    error: null | AxiosError;
    reFetch: () => void;
  } = useAxios({
    axios: axiosInstance,
    method,
    url,
    options: {
      data: route.body ? body : null, // Don't sent data if `body` is not specified by the `route` definition
    },
  });

  // When a Reset button is clicked, it resets all Params
  const resetAllParams = useCallback(() => {
    setQsParams({});
    setBody({});
    setUrlParams({});
  }, [setUrlParams, setBody, setUrlParams]);

  const styles = useMemo(() => {
    return {
      container: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
    };
  }, [darkMode]);

  const responseDOM = useMemo(() => {
    return <Response response={response} body={body} error={error} />;
  }, [response, body, error]);

  return (
    <div
      className={`overflow-hidden p-4 border rounded overflow-x-hidden mb-4 ${styles.container}`}
    >
      <TopBar
        route={route}
        darkMode={darkMode}
        qsParams={qsParams}
        urlParams={urlParams}
      />
      <div className="flex py-2 mb-2">
        <Request
          route={route}
          resetAllParams={resetAllParams}
          loading={loading}
          qsParams={qsParams}
          body={body}
          urlParams={urlParams}
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

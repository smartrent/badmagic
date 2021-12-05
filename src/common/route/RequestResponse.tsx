import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useAxios } from "../../hooks/use-axios";
import axios, { AxiosResponse, AxiosError } from "axios";

import { useGlobalContext } from "../../context/GlobalContext";

import { Response } from "./Response";
import { Request } from "./Request";
import { TopBar } from "./TopBar";

import helpers from "../../lib/helpers";
import {
  Route,
  Method,
  ApplyAxiosInterceptors,
  StoreHistoricResponsePayload,
  Param,
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

  // When the route changes, reset params
  useEffect(() => {
    // Set default values in state, but this currently doesn't handle recursive default values like
    // object properties or array default values
    const defaultBodyParams = helpers.reduceDefaultParamValues(route?.body);
    const defaultQsParams = helpers.reduceDefaultParamValues(route?.qsParams);

    setUrlParams({});
    setQsParams(defaultQsParams);
    setBody(defaultBodyParams);
  }, [route]);

  const url = useMemo(() => {
    return helpers.buildUrl({
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
      data: route.body ? body : null, // Don't send data if `body` is not specified by the `route` definition
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

  // When the route changes or the response changes, regenerate ResponseDOM
  const responseDOM = useMemo(() => {
    return <Response response={response} body={body} error={error} />;
  }, [response, body, error]);

  return (
    <div
      className={`overflow-hidden p-4 border rounded overflow-x-hidden mb-4 ${styles.container}`}
    >
      <TopBar route={route} qsParams={qsParams} urlParams={urlParams} />
      <div className="flex py-2">
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

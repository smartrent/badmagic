import React, { useState, useEffect, useCallback, useMemo } from "react";
import { get, compact } from "lodash-es";
import useAxios from "@smartrent/use-axios";
import axios from "axios";
import { AxiosError } from "axios";
import * as yup from "yup";

import { useGlobalContext } from "./context/Context";
import Params from "./route/Params";
import BodyPreview from "./route/BodyPreview";
import ApiError from "./route/ApiError";
import ApiResponse from "./route/ApiResponse";
import Error from "./common/Error";
import Button from "./common/Button";
import InjectPlugins from "./route/InjectPlugins";
import Navigation from "./route/Navigation";
import Docs from "./route/Documentation";

import Helpers from "./lib/helpers";
import { Route, Inject, ParamType } from "./types";

export default function Route({
  route,
  baseUrl,
  workspacePlugins,
}: {
  route: Route;
  baseUrl: string;
  workspacePlugins?: any[];
}) {
  const { darkMode } = useGlobalContext();
  const [validationErrors, setValidationErrors] = useState([]);
  const [urlParams, setUrlParams] = useState({});
  const [qsParams, setQsParams] = useState({});
  const [body, setBody] = useState({});
  const [headers, setHeaders] = useState({});

  const method = route.method ? route.method.toLowerCase() : "get";
  const { response, loading, error, reFetch } = useAxios({
    axios: axios.create({
      baseURL: baseUrl,
      headers: headers || {},
    }),
    method: route.method || "GET",
    url: Helpers.buildUrl({
      route,
      urlParams,
      baseUrl,
      qsParams: qsParams || {},
    }),
    options: {
      data: route.body ? body : null,
    },
  });

  // When a Reset button is clicked, it resets all Params
  const resetAllParams = useCallback(() => {
    setQsParams({});
    setBody({});
    setUrlParams({});
  }, [setUrlParams, setBody, setUrlParams]);

  // Before submitting a network request, validate that the request is valid
  // Note: Currently only supports URL Param validation
  const reFetchWithValidation = useCallback(() => {
    // @todo: Use Yup to validate all nested, required fields, currently this only supports urlParams
    const requiredUrlParams = Helpers.getUrlParamsFromPath(route.path).reduce(
      (accumulator, { name }) => {
        accumulator[name] = yup
          .string()
          .required()
          .min(1);

        return accumulator;
      },
      {} as Record<string, any>
    );

    const yupUrlParamSchema = yup.object().shape(requiredUrlParams);
    try {
      yupUrlParamSchema.validateSync(urlParams);
      return reFetch();
    } catch (err) {
      // Yup returns errors like `urlParams.someField is required`, so we trim off the prefix

      // @ts-ignore
      if (err?.errors?.length) {
        setValidationErrors(
          // @ts-ignore
          err?.errors?.map((message: string) =>
            message.slice(message.indexOf(".") + 1)
          )
        );
      }
    }
    return {};
  }, [urlParams, route]);

  // @todo store API response in local storage in a responses tab that is re-playable
  // useEffect(() => {
  //   if (response || error || loading) {
  //     console.log(response, error, loading);
  //   }
  // }, [response, loading, error, route]);

  // Route plugins completely override workspace plugins
  // If Route plugins are not specified, this will default to workspace plugins
  const plugins =
    route.plugins && route.plugins.length ? route.plugins : workspacePlugins;

  return (
    <div
      style={route.sticky ? { borderRight: "1px solid rgb(251, 189, 28)" } : {}}
      className={`border rounded overflow-x-hidden ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
      }`}
    >
      <div
        className="flex justify-start items-center overflow-hidden p-2"
        style={{ cursor: "pointer" }}
      >
        <div
          className={`w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border rounded ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
          style={{
            backgroundColor: get(Helpers.colors.routes, method),
          }}
        >
          {method.toUpperCase()}
        </div>

        {route?.deprecated && (
          <div
            className={`flex flex-shrink-0 items-center justify-center text-xs text-white font-semibold p-1 mr-2 bg-red-700 rounded`}
          >
            DEPRECATED
          </div>
        )}

        <div
          className={`flex flex-grow-2 mr-auto ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {Helpers.buildUrl({
            route,
            urlParams,
            baseUrl: "",
            qsParams,
          })}
        </div>
        <div
          className={`flex text-right ml-2 mr-1 items-center ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {route.name}
        </div>
      </div>
      <div className="flex p-2 mb-2">
        <>
          <InjectPlugins
            style={{ flex: 1, marginRight: "1rem" }}
            inject={Inject.asRequest}
            route={route}
            reFetch={reFetchWithValidation}
            loading={loading}
            plugins={plugins || []}
          >
            <Params
              paramType={ParamType.urlParams}
              reFetch={reFetchWithValidation}
              route={route}
              values={urlParams}
              setValues={setUrlParams}
            />
            <Params
              paramType={ParamType.body}
              reFetch={reFetchWithValidation}
              route={route}
              values={body}
              setValues={setBody}
            />
            <Params
              paramType={ParamType.qsParams}
              reFetch={reFetchWithValidation}
              route={route}
              values={qsParams}
              setValues={setQsParams}
            />
            {!!validationErrors?.length ? (
              <div className="my-2">
                {(validationErrors || []).map((validationError, idx) => (
                  <Error key={idx}>{validationError}</Error>
                ))}
              </div>
            ) : null}

            <Button outline onClick={resetAllParams}>
              Reset
            </Button>
            <Button
              className="ml-2"
              disabled={loading}
              onClick={reFetchWithValidation}
            >
              {loading ? "Loading..." : "Try"}
            </Button>
          </InjectPlugins>
          <InjectPlugins
            style={{ flex: 3, overflow: "hidden" }}
            inject={Inject.asResponse}
            route={route}
            reFetch={reFetchWithValidation}
            loading={loading}
            plugins={plugins || []}
          >
            <BodyPreview body={body} />
            <ApiResponse response={response} />
            <ApiError error={error as AxiosError} />
          </InjectPlugins>
        </>
      </div>
      <div>
        <div
          className={`text-xl ${darkMode ? "text-gray-100" : "text-gray-800"}`}
        >
          Documentation
        </div>
        <Docs documentation={route.documentation} darkMode={darkMode} />
      </div>
    </div>
  );
}

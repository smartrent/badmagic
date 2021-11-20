import React, { useState, useEffect, useCallback, useMemo } from "react";
import { get } from "lodash-es";
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
import Docs from "./route/Documentation";

import Helpers from "./lib/helpers";
import { Route, ParamType, Workspace, Method } from "./types";

export default function Route({
  route,
  workspace,
}: {
  route: Route;
  workspace: Workspace;
}) {
  const { darkMode } = useGlobalContext();
  const [validationErrors, setValidationErrors] = useState([]);
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

  const { response, loading, error, reFetch } = workspace.useAxiosMiddleware
    ? workspace.useAxiosMiddleware({
        method,
        urlParams, // included in case it's needed, but `url` should already have everything we need
        qsParams, // included in case it's needed, but `url` should already have everything we need
        body,
        url, // url includes qsParams and urlParams
        route,
      })
    : useAxios({
        axios: axios.create({
          baseURL: route?.baseUrl,
          headers: {}, // by default no headers are set. If you need to pass headers, use `useAxiosMiddleware`
        }),
        method,
        url,
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

  const styles = useMemo(() => {
    return {
      tryRequestContainer: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-white border-gray-300",
      methodContainer: darkMode ? "border-gray-700" : "border-gray-300",
      headerText: darkMode ? "text-gray-100" : "text-gray-800",
      documentationContainer: `px-4 border rounded overflow-x-hidden ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
      }`,
    };
  }, [darkMode]);

  // @todo store API response in local storage in a responses tab that is re-playable
  // useEffect(() => {
  //   if (response || error || loading) {
  //     console.log(response, error, loading);
  //   }
  // }, [response, loading, error, route]);

  return (
    <div>
      <div className={`text-xl ${styles.headerText}`}>Try Request</div>
      <div
        className={`overflow-hidden p-2 border rounded overflow-x-hidden mb-4 ${styles.tryRequestContainer}`}
      >
        <div className="flex justify-start items-center mb-4">
          <div
            className={`w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border rounded ${styles.methodContainer}`}
            style={{
              backgroundColor: get(Helpers.colors.routes, method),
            }}
          >
            {method}
          </div>

          {route?.deprecated && (
            <div className="flex flex-shrink-0 items-center justify-center text-xs text-white font-semibold p-1 mr-2 bg-red-700 rounded">
              DEPRECATED
            </div>
          )}

          <div className={`flex flex-grow-2 mr-auto ${styles.headerText}`}>
            {Helpers.buildPath({
              route,
              urlParams,
              qsParams,
            })}
          </div>
          <div
            className={`flex text-right ml-2 mr-1 items-center ${styles.headerText}`}
          >
            {route.name}
          </div>
        </div>

        <div className="flex p-2 mb-2">
          <>
            <div className="flex flex-col flex-grow mr-4">
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

              <div className="flex">
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
              </div>
            </div>
            <div style={{ flex: 3, overflow: "hidden" }}>
              <BodyPreview body={body} />
              <ApiResponse response={response} />
              <ApiError error={error as AxiosError} />
            </div>
          </>
        </div>
      </div>

      <div className={`text-xl ${styles.headerText}`}>Documentation</div>
      <div className={styles.documentationContainer}>
        <Docs documentation={route.documentation} darkMode={darkMode} />
      </div>
    </div>
  );
}

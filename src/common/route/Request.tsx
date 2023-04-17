import React, { useState, useCallback } from "react";
import * as yup from "yup";

import Params from "./Params";

import Error from "../Error";
import Button from "../Button";
import { useActiveRoute } from "../../lib/hooks/useActiveRoute";

import Helpers from "../../lib/helpers";
import { HistoricResponse } from "../../types";

export function Request({
  reFetch,
  requestResponse,
  setUrlParams,
  setBody,
  setQsParams,
  resetAllParams,
  loading,
}: {
  requestResponse: HistoricResponse;
  reFetch: () => void;
  setUrlParams: (urlParams: Record<string, any>) => void;
  setBody: (urlParams: Record<string, any>) => void;
  setQsParams: (urlParams: Record<string, any>) => void;
  resetAllParams: () => void;
  loading: boolean;
}) {
  const route = useActiveRoute();
  const { urlParams, body, qsParams } = requestResponse;
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Before submitting a network request, validate that the request is valid
  // Note: Currently only supports URL Param validation
  const reFetchWithValidation = useCallback(() => {
    if (!route) {
      return () => {};
    }

    // @todo: Use Yup to validate all nested, required fields, currently this only supports urlParams
    const requiredUrlParams = Helpers.getUrlParamsFromPath(route.path).reduce(
      (accumulator, { name }) => {
        accumulator[name] = yup.string().required().min(1);

        return accumulator;
      },
      {} as Record<string, any>
    );

    const yupUrlParamSchema = yup.object().shape(requiredUrlParams);
    try {
      yupUrlParamSchema.validateSync(urlParams);
    } catch (err) {
      // Yup returns errors like `urlParams.someField is required`, so we trim off the prefix
      if (err instanceof yup.ValidationError && err?.errors?.length) {
        setValidationErrors(
          err?.errors?.map((message: string) =>
            message.slice(message.indexOf(".") + 1)
          )
        );
      }
    }
    return reFetch();
  }, [urlParams, route]);

  if (!route) {
    return null;
  }

  return (
    <div className="flex flex-col flex-grow mr-4">
      <Params
        paramType="urlParams"
        reFetch={reFetchWithValidation}
        route={route}
        values={urlParams}
        setValues={setUrlParams}
      />
      <Params
        paramType="body"
        reFetch={reFetchWithValidation}
        route={route}
        values={body}
        setValues={setBody}
      />
      <Params
        paramType="qsParams"
        reFetch={reFetchWithValidation}
        route={route}
        values={qsParams}
        setValues={setQsParams}
      />
      {validationErrors?.length ? (
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
        <Button className="ml-2" disabled={loading} onClick={reFetch}>
          {loading ? "Loading..." : "Try"}
        </Button>
      </div>
    </div>
  );
}

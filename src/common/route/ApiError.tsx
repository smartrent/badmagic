import React, { useMemo } from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";

import Headers from "./Headers";
import { useGlobalContext } from "../../context/GlobalContext";

import Helpers from "../../lib/helpers";

import { ApiError } from "../../types";

export default function ApiError({ error }: { error: null | ApiError }) {
  const { darkMode } = useGlobalContext();
  const styles = useMemo(() => {
    return {
      responseStatus: darkMode
        ? "bg-gray-800 border-gray-900"
        : "bg-gray-200 border-gray-400",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);
  if (!error?.response) {
    return null;
  }

  let responseColor;
  if (
    error?.response?.status &&
    error.response.status >= 200 &&
    error.response.status < 300
  ) {
    responseColor = Helpers.colors.green;
  } else if (error?.response?.status && error.response.status >= 400) {
    responseColor = Helpers.colors.red;
  }

  const isJSON = error.response.data && isObject(error.response.data);

  return (
    <div>
      {error?.response?.status ? (
        <div
          className={`flex-shrink-0 inline-flex text-xs font-bold border rounded py-1 px-2 mb-1 ${styles.responseStatus}`}
          style={{
            color: responseColor,
          }}
        >
          {error.response.status}
        </div>
      ) : null}

      {error.response.data && isJSON && (
        <ReactJson
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          src={error.response.data}
          theme={Helpers.reactJsonViewTheme(darkMode)}
        />
      )}

      {error.response.data && !isJSON && (
        <div
          className={`border border-gray-400 p-2 ${
            darkMode ? "text-white" : ""
          }`}
        >
          {error.response.data}
        </div>
      )}
    </div>
  );
}

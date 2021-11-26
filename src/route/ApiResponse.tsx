import React from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";
import { AxiosResponse } from "axios";

import Headers from "./Headers";
import { useGlobalContext } from "../context/GlobalContext";
import Helpers from "../lib/helpers";

export default function ApiResponse({
  response,
}: {
  response: null | AxiosResponse;
}) {
  const { darkMode } = useGlobalContext();

  if (!response) {
    return null;
  }

  let responseColor;
  if (response.status >= 200 && response.status < 300) {
    responseColor = Helpers.colors.green;
  } else if (response.status >= 400) {
    responseColor = Helpers.colors.red;
  }

  const isJSON = response.data && isObject(response.data);

  const hasResponseHeaders = !!Object.keys(response?.headers || {}).length;

  return (
    <div>
      {response?.status ? (
        <div
          className={`flex-shrink-0 inline-flex text-xs font-bold border rounded py-1 px-2 mb-1 ${
            darkMode
              ? "bg-gray-800 border-gray-900"
              : "bg-gray-200 border-gray-400"
          }`}
          style={{
            color: responseColor,
          }}
        >
          {response.status}
        </div>
      ) : null}

      {response.data && isJSON && (
        <ReactJson
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          src={response.data}
          theme={Helpers.reactJsonViewTheme(darkMode)}
          shouldCollapse={({ type, src, namespace, name }) => {
            // collapse anything more than 3 levels deep
            if (namespace.length > 3) {
              return true;
            }

            // collapse all but the first 5 elements of arrays
            if (Number(name) > 4) {
              return true;
            }

            // collapse arrays with more than 50 elements
            if (type === "array" && Array.isArray(src) && src.length > 50) {
              return true;
            }

            if (type === "object" && Object.keys(src).length > 50) {
              return true;
            }

            return false;
          }}
        />
      )}

      {response.data && !isJSON && (
        <div
          className={`border border-gray-400 p-2 ${
            darkMode ? "text-white" : ""
          }`}
        >
          {response.data}
        </div>
      )}

      {hasResponseHeaders ? <Headers headers={response.headers} /> : null}
    </div>
  );
}

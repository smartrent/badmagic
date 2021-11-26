import React from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";
import { AxiosError } from "axios";

import Headers from "./Headers";
import { useGlobalContext } from "../context/GlobalContext";

import Helpers from "../lib/helpers";

export default function ApiError({ error }: { error: null | AxiosError }) {
  const { darkMode } = useGlobalContext();
  if (!error?.response) {
    return null;
  }

  let responseColor;
  if (error?.response?.status >= 200 && error?.response?.status < 300) {
    responseColor = Helpers.colors.green;
  } else if (error?.response?.status >= 400) {
    responseColor = Helpers.colors.red;
  }

  const isJSON = error.response.data && isObject(error.response.data);

  const hasConfigHeaders = !!Object.keys(error?.config?.headers || {}).length;

  return (
    <div>
      {error?.response?.status ? (
        <div
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

      {hasConfigHeaders ? <Headers headers={error.config.headers} /> : null}
    </div>
  );
}

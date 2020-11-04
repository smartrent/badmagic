import React, { useContext } from "react";
import { get, isObject } from "lodash-es";
import ReactJson from "react-json-view";

import Headers from "./Headers";
import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function ApiResponse({ route }: { route: Route }) {
  const { routeConfig, darkMode } = useGlobalContext();
  const routeConfigVars = get(routeConfig, route.name, {
    response: {
      status: 0,
      data: "",
      config: {
        url: "",
      },
      headers: {},
    },
  });

  const { response } = routeConfigVars;
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

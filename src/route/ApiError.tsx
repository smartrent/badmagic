import React, { useContext } from "react";
import { get, isObject } from "lodash-es";
import ReactJson from "react-json-view";

import Headers from "./Headers";
import { useGlobalContext } from "../context/Context";

import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function ApiError({ route }: { route: Route }) {
  const context = useGlobalContext();
  const routeConfigVars = get(context.routeConfig, route.name, {
    error: {
      response: {
        status: 0,
        data: "",
      },
      config: {
        method: "GET",
        url: "",
        headers: {},
      },
    },
  });

  const { error } = routeConfigVars;
  if (!(error && error.response)) {
    return null;
  }

  let responseColor;
  if (error.response.status >= 200 && error.response.status < 300) {
    responseColor = Helpers.colors.green;
  } else if (error.response.status >= 400) {
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
          theme={Helpers.reactJsonViewTheme(context.darkMode)}
        />
      )}

      {error.response.data && !isJSON && (
        <div
          className={`border border-gray-400 p-2 ${
            context.darkMode ? "text-white" : ""
          }`}
        >
          {error.response.data}
        </div>
      )}

      {hasConfigHeaders ? <Headers headers={error.config.headers} /> : null}
    </div>
  );
}

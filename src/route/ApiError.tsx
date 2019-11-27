import React, { useContext } from "react";
import { get, isObject } from "lodash-es";
import ReactJson from "react-json-view";

import Headers from "./Headers";
import Context from "../Context";

import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function ApiError({ route }: { route: Route }) {
  const context = useContext(Context);
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

  return (
    <div>
      <div
        style={{
          color: responseColor,
        }}
      >
        {error.response.status}
      </div>

      {error.response.data && isJSON && (
        <ReactJson
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          src={error.response.data}
          theme={context.darkMode ? "bright" : "rjv-default"}
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

      <Headers headers={error.config.headers} />
    </div>
  );
}

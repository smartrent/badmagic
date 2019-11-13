import React, { useContext } from "react";
import { get } from "lodash-es";
import ReactJson from "react-json-view";

import Headers from "./Headers";
import Context from "../Context";
import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function ApiResponse({ route }: { route: Route }) {
  const { routeConfig, darkMode } = useContext(Context);
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

  return (
    <div>
      {response && response.status && (
        <div
          className="flex-shrink-0 inline-flex text-xs font-bold bg-transparent border rounded py-1 px-2 mb-2"
          style={{
            ...Helpers.getStyles(darkMode, "responseStatusCode"),
            color: responseColor,
          }}
        >
          {response.status}
        </div>
      )}

      {response.data && (
        <ReactJson
          enableClipboard={false}
          displayObjectSize={false}
          displayDataTypes={false}
          src={response.data}
          theme={darkMode ? "bright" : "rjv-default"}
        />
      )}

      <Headers headers={response.headers} />
    </div>
  );
}

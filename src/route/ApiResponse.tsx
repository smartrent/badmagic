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
          style={{
            ...Helpers.getStyles(darkMode, "responseStatusCode"),
            ...{
              color: responseColor,
              padding: "4px",
              borderRadius: "4px",
              width: "25px",
              textAlign: "center",
              fontSize: "12px",
              marginBottom: "4px",
            },
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

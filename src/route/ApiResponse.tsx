import React, { useContext } from "react";
import { get } from "lodash-es";

import Headers from "./Headers";
import Context from "../Context";
import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function ApiResponse({ route }: { route: Route }) {
  const { routeConfig } = useContext(Context);
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          fontSize: "10px",
          color: responseColor,
        }}
      >
        {response.status}
      </div>

      {response.data && (
        <textarea
          value={JSON.stringify(response.data, null, 2)}
          readOnly
          style={{
            width: "100%",
            height: "auto",
            minHeight: "125px",
          }}
        />
      )}

      <Headers headers={response.headers} />
    </div>
  );
}

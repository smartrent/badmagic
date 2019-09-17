import React, { useContext } from "react";
import { get } from "lodash-es";

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
        {error.response.status}
      </div>

      {error.response.data && (
        <textarea
          value={JSON.stringify(error.response.data, null, 2)}
          readOnly
          style={{
            width: "100%",
            height: "auto",
            minHeight: "125px",
          }}
        />
      )}

      <Headers headers={error.config.headers} />
    </div>
  );
}

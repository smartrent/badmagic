import React, { useContext, useEffect } from "react";
import useAxios from "@smartrent/use-axios";
import axios from "axios";
import { get } from "lodash-es";

import Context from "../Context";
import UrlParams from "./UrlParams";
import Body from "./Body";
import QSParams from "./QSParams";

import ApiError from "./ApiError";
import ApiResponse from "./ApiResponse";

import InjectPlugins from "./InjectPlugins";
import Helpers from "../lib/helpers";
import { Route } from "../types";

export default function RequestResponse({ route }: { route: Route }) {
  const context = useContext(Context);
  const { routeConfig, setApiResponse, workspace } = context;
  const routeConfigVars = get(routeConfig, route.name, {
    headers: {},
    urlParams: {},
    body: {},
  });

  const { response, loading, error, reFetch } = useAxios({
    axios: axios.create({
      baseURL: workspace.config.baseUrl,
      headers: routeConfigVars.headers,
    }),
    method: route.method || "GET",
    url: Helpers.buildUrl({
      route,
      urlParams: routeConfigVars.urlParams,
      baseUrl: workspace.config.baseUrl,
      qsParams: routeConfigVars.qsParams,
    }),
    options: {
      data: routeConfigVars.body,
    },
  });

  useEffect(() => {
    setApiResponse({ route, response, loading, error });
  }, [response, loading, error, route]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ paddingRight: "8px", flexGrow: 1, flexShrink: 1 }}>
          <UrlParams route={route} reFetch={reFetch} />
          <Body route={route} reFetch={reFetch} />
          <QSParams route={route} reFetch={reFetch} />
          <InjectPlugins injectAfter="request" route={route} />
          <button
            disabled={loading}
            onClick={() => {
              reFetch();
            }}
          >
            {loading ? "Loading..." : "Try"}
          </button>
        </div>
        <div
          style={{
            paddingLeft: "8px",
            paddingRight: "8px",
            flexGrow: 1,
            flexShrink: 1,
          }}
        >
          <ApiResponse route={route} />
          <ApiError route={route} />
          <InjectPlugins injectAfter="response" route={route} />
        </div>
      </div>
    </div>
  );
}

import React from "react";

import Params from "./Params";
import InjectPlugins from "./InjectPlugins";
import { Route, ParamType, Inject, Plugin } from "../types";

export default function Request({
  route,
  reFetch,
  loading,
  plugins,
}: {
  route: Route;
  reFetch: () => void;
  loading: boolean;
  plugins?: Plugin[];
}) {
  return (
    <InjectPlugins
      style={{ paddingRight: "8px", flexGrow: 1, flexShrink: 1 }}
      inject={Inject.asRequest}
      route={route}
      reFetch={reFetch}
      loading={loading}
      plugins={plugins || []}
    >
      <Params paramType={ParamType.urlParams} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.body} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.qsParams} reFetch={reFetch} route={route} />
      <button disabled={loading} onClick={reFetch}>
        {loading ? "Loading..." : "Try"}
      </button>
    </InjectPlugins>
  );
}

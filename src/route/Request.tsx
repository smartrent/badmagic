import React, { useContext } from "react";

import Params from "./Params";
import InjectPlugins from "./InjectPlugins";
import { Inject, ParamType, Plugin, Route } from "../types";
import Context from "../Context";
import Helpers from "../lib/helpers";

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
  const { setParam } = useContext(Context);

  return (
    <InjectPlugins
      style={{ overflow: "unset" }}
      inject={Inject.asRequest}
      route={route}
      reFetch={reFetch}
      loading={loading}
      plugins={plugins || []}
    >
      <Params paramType={ParamType.urlParams} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.body} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.qsParams} reFetch={reFetch} route={route} />
      <button onClick={() => Helpers.resetRequest(route, setParam)}>
        Reset
      </button>
      <button
        disabled={loading}
        onClick={reFetch}
        style={{ marginLeft: "4px" }}
      >
        {loading ? "Loading..." : "Try"}
      </button>
    </InjectPlugins>
  );
}

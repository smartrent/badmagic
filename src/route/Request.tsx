import React, { useContext } from "react";

import Params from "./Params";
import InjectPlugins from "./InjectPlugins";
import { Inject, ParamType, Plugin, Route } from "../types";
import Context from "../Context";

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
  const { setParam, getParam } = useContext(Context);

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
      <button onClick={()=> {
        route.body.forEach(param => {setParam({route, param, value: null, paramType: ParamType.body})})
      }}>Reset</button>
      <button disabled={loading} onClick={reFetch}>
        {loading ? "Loading..." : "Try"}
      </button>
    </InjectPlugins>
  );
}

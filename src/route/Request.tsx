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
      className="w-128"
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
      <button
        className="flex-shrink-0 bg-transparent hover:bg-gray-100 text-gray-600 py-2 px-4 border border-gray-500 rounded"
        onClick={() => Helpers.resetRequest(route, setParam)}
      >
        Reset
      </button>
      <button
        disabled={loading}
        onClick={reFetch}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        {loading ? "Loading..." : "Try"}
      </button>
    </InjectPlugins>
  );
}

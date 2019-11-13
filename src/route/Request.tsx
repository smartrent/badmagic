import React, { useContext } from "react";

import Params from "./Params";
import InjectPlugins from "./InjectPlugins";
import { Inject, ParamType, Plugin, Route } from "../types";
import Context from "../Context";
import Helpers from "../lib/helpers";
import Button from "../common/Button";

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
      style={{ flex: 1, marginRight: "1rem" }}
      inject={Inject.asRequest}
      route={route}
      reFetch={reFetch}
      loading={loading}
      plugins={plugins || []}
    >
      <Params paramType={ParamType.urlParams} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.body} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.qsParams} reFetch={reFetch} route={route} />
      <Button
        outline
        className="flex-shrink-0"
        onClick={() => Helpers.resetRequest(route, setParam)}
      >
        Reset
      </Button>
      <Button className="ml-2" disabled={loading} onClick={reFetch}>
        {loading ? "Loading..." : "Try"}
      </Button>
    </InjectPlugins>
  );
}

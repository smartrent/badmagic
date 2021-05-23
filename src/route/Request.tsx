import React from "react";

import { useGlobalContext } from "../context/Context";

import Helpers from "../lib/helpers";

import Params from "./Params";
import InjectPlugins from "./InjectPlugins";
import Button from "../common/Button";
import Error from "../common/Error";

import {
  RouteConfigVars,
  Inject,
  ParamType,
  Plugin,
  Route,
  OnSubmitFn,
} from "../types";

export default function Request({
  route,
  reFetch,
  loading,
  plugins,
}: {
  route: Route;
  reFetch: OnSubmitFn;
  loading: boolean;
  plugins?: Plugin[];
}) {
  const { setParam, routeConfig } = useGlobalContext();
  const routeConfigVars: undefined | RouteConfigVars = routeConfig[route.name];
  const validationErrors = routeConfigVars?.validationErrors;

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
      {!!validationErrors?.length ? (
        <div className="my-2">
          {(validationErrors || []).map((validationError, idx) => (
            <Error key={idx}>{validationError}</Error>
          ))}
        </div>
      ) : null}

      <Button outline onClick={() => Helpers.resetRequest(route, setParam)}>
        Reset
      </Button>
      <Button className="ml-2" disabled={loading} onClick={reFetch}>
        {loading ? "Loading..." : "Try"}
      </Button>
    </InjectPlugins>
  );
}

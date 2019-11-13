import React from "react";

import ApiError from "./ApiError";
import ApiResponse from "./ApiResponse";
import InjectPlugins from "./InjectPlugins";
import { Route, Inject, Plugin } from "../types";

export default function Request({
  route,
  reFetch,
  loading,
  plugins,
}: {
  route: Route;
  reFetch: () => {};
  loading: boolean;
  plugins?: Plugin[];
}) {
  return (
    <InjectPlugins
      style={{ flex: 3 }}
      inject={Inject.asResponse}
      route={route}
      reFetch={reFetch}
      loading={loading}
      plugins={plugins || []}
    >
      <ApiResponse route={route} />
      <ApiError route={route} />
    </InjectPlugins>
  );
}

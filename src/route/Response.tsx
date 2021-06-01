import React from "react";

import ApiError from "./ApiError";
import ApiResponse from "./ApiResponse";
import InjectPlugins from "./InjectPlugins";
import { Route, Inject, Plugin, OnSubmitFn } from "../types";
import BodyPreview from "./BodyPreview";

export default function Response({
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
  return (
    <InjectPlugins
      style={{ flex: 3, overflow: "hidden" }}
      inject={Inject.asResponse}
      route={route}
      reFetch={reFetch}
      loading={loading}
      plugins={plugins || []}
    >
      <BodyPreview route={route} />
      <ApiResponse route={route} />
      <ApiError route={route} />
    </InjectPlugins>
  );
}

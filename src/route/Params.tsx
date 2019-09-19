import React from "react";
import { map } from "lodash-es";

import Input from "../common/Input";
import Helpers from "../lib/helpers";

import { Route, Param, ParamType } from "../types";

export default function Params({
  route,
  reFetch,
  paramType,
}: {
  route: Route;
  reFetch: () => void;
  paramType: ParamType;
}) {
  let inputs = [];
  if (paramType === ParamType.body) {
    inputs = route.body || [];
  } else if (paramType === ParamType.qsParams) {
    inputs = route.qsParams || [];
  } else if (paramType === ParamType.urlParams) {
    inputs = Helpers.getUrlParamsFromPath(route.path);
  }

  if (!(inputs && inputs.length)) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "8px",
      }}
    >
      {map(inputs, (param: Param, idx) => (
        <Input
          key={idx}
          route={route}
          param={param}
          reFetch={reFetch}
          paramType={paramType}
        />
      ))}
    </div>
  );
}

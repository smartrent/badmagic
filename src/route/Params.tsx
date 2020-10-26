import React from "react";
import { map, assign } from "lodash-es";

import Input from "../common/Input";
import Label from "../common/Label";
import Helpers from "../lib/helpers";

import { Route, Param, ParamType } from "../types";

type RefetchFn = () => void;
interface MapInputsOptions {
  inputs: Param[];
  route: Route;
  paramType: ParamType;
  reFetch: RefetchFn;
  parent: null | string;
}

function mapInputs({
  inputs,
  route,
  paramType,
  reFetch,
  parent,
}: MapInputsOptions) {
  return map(inputs, (param: Param, idx: number) => {
    // Object datatype
    if (param.properties) {
      return (
        <div className="mb-2" key={idx}>
          <Label size="lg">{param.label}</Label>
          {mapInputs({
            inputs: param.properties,
            route,
            paramType,
            reFetch,
            parent: param.name,
          })}
        </div>
      );
    }

    // Other data types
    return (
      <Input
        key={idx}
        route={route}
        param={
          paramType === ParamType.urlParams
            ? assign(param, { required: true })
            : param
        }
        reFetch={reFetch}
        paramType={paramType}
        parent={parent}
      />
    );
  });
}

export default function Params({
  route,
  reFetch,
  paramType,
}: {
  route: Route;
  reFetch: RefetchFn;
  paramType: ParamType;
}) {
  let inputs: Param[] = [];
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
    <div className="mb-2">
      {mapInputs({ inputs, route, paramType, reFetch, parent: null })}
    </div>
  );
}

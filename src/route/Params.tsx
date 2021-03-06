import React, { useEffect } from "react";
import { map, startCase } from "lodash-es";

import Input from "../common/Input";
import Label from "../common/Label";
import Required from "../common/Required";
import { ClearValueButton } from "../common/ClearValueButton";
import { ApplyNullValueButton } from "../common/ApplyNullValueButton";
import { AddArrayCell } from "../common/AddArrayCell";
import { RemoveArrayCellButton } from "../common/RemoveArrayCellButton";

import Helpers from "../lib/helpers";

import { useGlobalContext } from "../context/Context";

import {
  Route,
  Param,
  ParamType,
  Size,
  OnSubmitFn,
  RenderInputsProps,
  RenderInputByDataTypeProps,
  RenderObjectProps,
  RenderArrayOfInputsProps,
} from "../types";
import Tooltip from "../common/Tooltip";

function RenderArrayOfInputs({
  onSubmit,
  pathToValue,
  param,
  label,
}: RenderArrayOfInputsProps) {
  const { setParam, getFromRouteConfig } = useGlobalContext();
  const values = getFromRouteConfig({ pathToValue });

  // Initialize value(s) for this input in local storage and state if they aren't already set
  useEffect(() => {
    if (!Array.isArray(values)) {
      setParam({
        value:
          param?.defaultValue && Array.isArray(param?.defaultValue)
            ? param?.defaultValue
            : [],
        pathToValue,
      });
    }
  }, [pathToValue, values]);

  // Wait for initialization before rendering further
  if (!Array.isArray(values)) {
    return null;
  }

  return (
    <>
      <InputLabelContainer
        label={label}
        required={param.required}
        size="lg"
        marginBottomClass="mb-0"
      >
        <AddArrayCell param={param} values={values} pathToValue={pathToValue} />
        <Tooltip description={param.description} />
      </InputLabelContainer>

      {values.map((value: any, valueIdx: number) => {
        // We don't support arrays of arrays
        return (
          <InputContainer key={valueIdx} className="mb-1">
            <RenderInputByDataType
              pathToValue={`${pathToValue}[${valueIdx}]`}
              onSubmit={onSubmit}
              param={{ ...param, array: false }}
              onRemoveCell={() => {
                let newValues = [...values];
                newValues.splice(valueIdx, 1);
                setParam({ param, pathToValue, value: newValues });
              }}
            />
          </InputContainer>
        );
      })}
    </>
  );
}

function RenderObject({
  param,
  pathToValue,
  onSubmit,
  onRemoveCell,
  label,
}: RenderObjectProps) {
  const { setParam, getFromRouteConfig, darkMode } = useGlobalContext();
  const value = getFromRouteConfig({ pathToValue });

  // Initialize value(s) for this input in local storage and state if they aren't already set
  useEffect(() => {
    if (!value) {
      setParam({ param, value: param?.defaultValue || {}, pathToValue });
    }
  }, [pathToValue, param, value]);

  // Initialize before rendering further
  if (!value) {
    return null;
  }

  // Make typescript happy
  if (param.properties === undefined) {
    return null;
  }

  return (
    <div className={`flex flex-grow ${onRemoveCell ? "flex-row" : "flex-col"}`}>
      {!onRemoveCell && label ? (
        <InputLabelContainer
          label={label}
          required={param.required}
          size="lg"
          marginBottomClass="mb-0"
        >
          <Tooltip description={param.description} />
        </InputLabelContainer>
      ) : null}
      <div
        className={`border border-dotted rounded-sm ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } flex flex-col flex-grow`}
      >
        {onRemoveCell ? (
          <button
            onClick={onRemoveCell}
            className="mt-1 mr-1 w-5 text-xs self-end hover:bg-red-700 bg-red-600 text-white font-semibold border border-red-600 rounded-full"
          >
            x
          </button>
        ) : null}
        <div className="px-2 p-1">
          <RenderInputs
            inputs={param.properties}
            onSubmit={onSubmit}
            pathToValue={pathToValue}
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );
}

function InputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-grow ${className ? className : ""}`}>
      {children}
    </div>
  );
}

function InputLabelContainer({
  label,
  children,
  required,
  size,
  marginBottomClass,
}: {
  label: string;
  children?: React.ReactNode;
  required?: boolean;
  size: Size;
  marginBottomClass?: string;
}) {
  return (
    <div className="flex items-center">
      <Label size={size || "lg"} marginBottomClass={marginBottomClass}>
        {label} {required && <Required />}
      </Label>
      {children}
    </div>
  );
}

function RenderInputByDataType({
  onSubmit,
  pathToValue,
  param,
  onRemoveCell,
}: RenderInputByDataTypeProps) {
  const { setParam, getFromRouteConfig, routeConfig } = useGlobalContext();
  const label = param.label || startCase(param.name);

  // Dev Note: Arrays of arrays are not supported
  if (param.array) {
    return (
      <RenderArrayOfInputs
        onSubmit={onSubmit}
        pathToValue={pathToValue}
        param={param}
        label={label}
      />
    );
  } else if (param.properties) {
    return (
      <RenderObject
        onSubmit={onSubmit}
        pathToValue={pathToValue}
        param={param}
        label={label}
        onRemoveCell={onRemoveCell}
      />
    );
  }

  const value = getFromRouteConfig({ pathToValue });

  return (
    <InputContainer className="flex-col">
      {!onRemoveCell ? (
        <InputLabelContainer
          label={label}
          required={param.required}
          size="lg"
          marginBottomClass="mb-0"
        >
          <Tooltip description={param.description} />
        </InputLabelContainer>
      ) : null}
      <InputContainer>
        <Input
          value={value}
          label={label}
          options={param.options}
          type={param.type}
          placeholder={param.placeholder}
          required={param.required}
          onChange={(newValue: any) =>
            setParam({
              param,
              value: newValue,
              pathToValue,
            })
          }
          onSubmit={onSubmit}
        />
        <ClearValueButton
          onRemoveCell={onRemoveCell}
          pathToValue={pathToValue}
          hidden={
            param.required
              ? true
              : value !== null || (!!value && param.nullable === false)
          }
        />
        {param.nullable !== false ? (
          <ApplyNullValueButton
            onRemoveCell={onRemoveCell}
            pathToValue={pathToValue}
            value={value}
          />
        ) : null}
        <RemoveArrayCellButton onRemoveCell={onRemoveCell} className="ml-1" />
      </InputContainer>
    </InputContainer>
  );
}

function RenderInputs({
  inputs,
  onSubmit,
  pathToValue,
  className,
}: RenderInputsProps) {
  return (
    <>
      {map(inputs, (param: Param, idx: number) => {
        return (
          <div className={className} key={idx}>
            <RenderInputByDataType
              param={param}
              key={idx}
              onSubmit={onSubmit}
              pathToValue={`${pathToValue}[${param.name}]`}
            />
          </div>
        );
      })}
    </>
  );
}

export default function Params({
  route,
  reFetch,
  paramType,
}: {
  route: Route;
  reFetch: OnSubmitFn;
  paramType: ParamType;
}) {
  const { getFromRouteConfig } = useGlobalContext();

  // Checks if we have body params, url params, or QS params for this route.
  // If we don't, we can cancel further rendering
  let inputs: Param[] = [];
  if (paramType === ParamType.body) {
    inputs = route.body || [];
  } else if (paramType === ParamType.qsParams) {
    inputs = route.qsParams || [];
  } else if (paramType === ParamType.urlParams) {
    inputs = Helpers.getUrlParamsFromPath(route.path);
  }

  if (!inputs?.length) {
    return null;
  }

  // Fetches all kv pairs from qsParams, body, or urlParams that are stored in local storage (and state)
  const pathToValue = `[${route?.name}][${paramType}]`;

  // Log an error and cancel rendering if this doesn't exist.
  // We expect that this was initialized already.
  const inputValues = getFromRouteConfig({ pathToValue });
  if (!inputValues) {
    console.error("An error occurred while mapping inputs inside `Params`");
    return null;
  }

  return (
    <div className="mb-2">
      <RenderInputs
        inputs={inputs}
        onSubmit={reFetch}
        pathToValue={pathToValue}
        className="mb-4"
      />
    </div>
  );
}

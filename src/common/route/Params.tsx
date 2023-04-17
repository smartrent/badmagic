import React, { useState, useEffect } from "react";
import { startCase, get, set, unset } from "lodash-es";

import Input from "../Input";
import { ClearValueButton } from "../ClearValueButton";
import { ApplyNowDateButton } from "../ApplyNowDateButton";
import { ApplyNullValueButton } from "../ApplyNullValueButton";
import { AddArrayCell } from "../AddArrayCell";
import { RemoveArrayCellButton } from "../RemoveArrayCellButton";

import { InputContainer } from "../InputContainer";
import { InputLabelContainer } from "../InputLabelContainer";
import { AddCustomParam } from "./AddCustomParam";

import Helpers from "../../lib/helpers";

import { useGlobalContext } from "../../context/GlobalContext";
import Tooltip from "../Tooltip";

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
  Option,
} from "../../types";

function RenderArrayOfInputs({
  onSubmit,
  pathToValue,
  param,
  label,
  values,
  setValues,
}: RenderArrayOfInputsProps) {
  const arrayOfValues = get(values, pathToValue, param?.defaultValue || []);

  return (
    <>
      <InputLabelContainer
        label={label}
        required={param.required}
        size="lg"
        marginBottomClass="mb-0"
      >
        <AddArrayCell
          param={param}
          values={values}
          setValues={setValues}
          arrayOfValues={arrayOfValues}
          pathToValue={pathToValue}
        />
        <Tooltip description={param.description} />
      </InputLabelContainer>

      {arrayOfValues.map((value: any, valueIdx: number) => {
        // We don't support arrays of arrays
        return (
          <InputContainer key={valueIdx} className="mb-1">
            <RenderInputByDataType
              pathToValue={`${pathToValue}[${valueIdx}]`}
              onSubmit={onSubmit}
              param={{ ...param, array: false }}
              values={values}
              setValues={setValues}
              onRemoveCell={() => {
                const newArrayValues = [...arrayOfValues];
                newArrayValues.splice(valueIdx, 1);
                if (newArrayValues.length) {
                  setValues(set({ ...values }, pathToValue, newArrayValues));
                } else {
                  const newValues = { ...values };
                  unset(newValues, pathToValue); //mutates
                  setValues(newValues);
                }
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
  values,
  setValues,
}: RenderObjectProps) {
  const { darkMode } = useGlobalContext();

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
            pathToValue={pathToValue ? pathToValue : `[${param.name}]`}
            className="mb-4"
            values={values}
            setValues={setValues}
          />
        </div>
      </div>
    </div>
  );
}

function RenderInputByDataType({
  onSubmit,
  pathToValue,
  param,
  onRemoveCell,
  values,
  setValues,
}: RenderInputByDataTypeProps) {
  const label = param.label || startCase(param.name);

  // Dev Note: Arrays of arrays are not supported
  if (param.array) {
    return (
      <RenderArrayOfInputs
        onSubmit={onSubmit}
        pathToValue={pathToValue}
        param={param}
        label={label}
        values={values}
        setValues={setValues}
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
        values={values}
        setValues={setValues}
      />
    );
  }

  const value = get(values, pathToValue, param?.defaultValue);

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
          onChange={(newValue: any) => {
            let parsedValue = newValue;
            if (param.json) {
              try {
                parsedValue = JSON.parse(newValue);
              } catch (err) {
                //
              }
            }

            return setValues(set({ ...values }, pathToValue, parsedValue));
          }}
          onSubmit={onSubmit}
        />
        <ApplyNowDateButton
          onRemoveCell={onRemoveCell}
          pathToValue={pathToValue}
          reference={param.placeholder}
          values={values}
          setValues={setValues}
        />
        <ClearValueButton
          onRemoveCell={onRemoveCell}
          pathToValue={pathToValue}
          hidden={
            param.required
              ? true
              : value !== null || (!!value && param.nullable === false)
          }
          values={values}
          setValues={setValues}
        />
        {param.nullable !== false ? (
          <ApplyNullValueButton
            onRemoveCell={onRemoveCell}
            pathToValue={pathToValue}
            value={value}
            values={values}
            setValues={setValues}
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
  values,
  setValues,
}: RenderInputsProps) {
  return (
    <>
      {inputs.map((param: Param) => {
        return (
          <div className={className} key={param.name}>
            <RenderInputByDataType
              param={param}
              onSubmit={onSubmit}
              pathToValue={
                pathToValue
                  ? `${pathToValue}[${param.name}]`
                  : `[${param.name}]`
              }
              values={values}
              setValues={setValues}
            />
          </div>
        );
      })}
    </>
  );
}

function fetchInputsFromRouteDefinition(
  route: Route,
  paramType: ParamType,
  customParams: Param[]
): Param[] {
  let routeDefinitionParams = [];
  if (paramType === "body") {
    routeDefinitionParams = route.body || [];
  } else if (paramType === "qsParams") {
    routeDefinitionParams = route.qsParams || [];
  } else {
    routeDefinitionParams = Helpers.getUrlParamsFromPath(route.path);
  }

  return [...routeDefinitionParams, ...customParams];
}

export default function Params({
  route,
  reFetch,
  paramType,
  values,
  setValues,
}: {
  route: Route;
  reFetch: OnSubmitFn;
  paramType: ParamType;
  values: Record<string, any>;
  setValues: (values: any) => void;
}) {
  const [customParams, setCustomParams] = useState<Param[]>([]);
  let inputs = fetchInputsFromRouteDefinition(route, paramType, customParams);

  // As the user switches between routes, ensure the custom params created on the previous route don't persist
  useEffect(() => {
    setCustomParams([]);
  }, [route.name]);

  // Checks if we have body params, url params, or QS params for this route (based on ParamType).
  // If we don't, we can cancel further rendering
  if (!inputs?.length) {
    return null;
  }

  // `pathToValue` is used to track which value is being edited in a potentially deeply nested object with `_.get`
  // This handles recursively refecting the deeply nested value
  // Since this is the top level, we are starting at the top-level, we have no pathToValue yet, so we set ""
  const pathToValue = "";

  return (
    <div className="mb-2">
      <RenderInputs
        inputs={inputs}
        onSubmit={reFetch}
        pathToValue={pathToValue}
        className="mb-4"
        setValues={setValues}
        values={values}
      />
      {["body", "qsParams"].includes(paramType) ? (
        <AddCustomParam
          customParams={customParams}
          setCustomParams={setCustomParams}
          paramType={paramType}
        />
      ) : null}
    </div>
  );
}

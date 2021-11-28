import React from "react";
import { startCase, get, set, unset } from "lodash-es";

import Input from "../Input";
import Label from "../Label";
import Required from "../Required";
import { ClearValueButton } from "../ClearValueButton";
import { ApplyNullValueButton } from "../ApplyNullValueButton";
import { AddArrayCell } from "../AddArrayCell";
import { RemoveArrayCellButton } from "../RemoveArrayCellButton";

import Helpers from "../../lib/helpers";

import { useGlobalContext } from "../../context/GlobalContext";

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
} from "../../types";
import Tooltip from "../Tooltip";

function RenderArrayOfInputs({
  onSubmit,
  pathToValue,
  param,
  label,
  values,
  setValues,
}: RenderArrayOfInputsProps) {
  const newPathToValue = pathToValue
    ? `${pathToValue}[${param.name}]`
    : `[${param.name}]`;
  const arrayOfValues = get(values, newPathToValue) || [];

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
          pathToValue={newPathToValue}
        />
        <Tooltip description={param.description} />
      </InputLabelContainer>

      {arrayOfValues.map((value: any, valueIdx: number) => {
        // We don't support arrays of arrays
        return (
          <InputContainer key={valueIdx} className="mb-1">
            <RenderInputByDataType
              pathToValue={`${newPathToValue}[${valueIdx}]`}
              onSubmit={onSubmit}
              param={{ ...param, array: false }}
              values={values}
              setValues={setValues}
              onRemoveCell={() => {
                let newArrayValues = [...arrayOfValues];
                newArrayValues.splice(valueIdx, 1);
                if (newArrayValues.length) {
                  setValues(set({ ...values }, newPathToValue, newArrayValues));
                } else {
                  const newValues = { ...values };
                  unset(newValues, newPathToValue); //mutates
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

  const newPathToValue = pathToValue
    ? `${pathToValue}[${param.name}]`
    : `[${param.name}]`;
  const value = get(values, newPathToValue);

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
            setValues(set({ ...values }, newPathToValue, newValue))
          }
          onSubmit={onSubmit}
        />
        <ClearValueButton
          onRemoveCell={onRemoveCell}
          pathToValue={newPathToValue}
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
            pathToValue={newPathToValue}
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
              pathToValue={pathToValue}
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
  paramType: ParamType
): Param[] {
  if (paramType === ParamType.body) {
    return route.body || [];
  } else if (paramType === ParamType.qsParams) {
    return route.qsParams || [];
  }

  // URL params is the only other valid options
  return Helpers.getUrlParamsFromPath(route.path);
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
  const inputs = fetchInputsFromRouteDefinition(route, paramType);

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
    </div>
  );
}

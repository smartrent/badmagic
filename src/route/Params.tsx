import React, { useEffect } from "react";
import { map, startCase } from "lodash-es";

import Input from "../common/Input";
import Label from "../common/Label";
import Required from "../common/Required";
import Button from "../common/Button";

import Helpers from "../lib/helpers";

import { useGlobalContext } from "../context/Context";

import { Route, Param, ParamType, Size } from "../types";

type OnSubmitFn = () => void;
interface RenderInputsProps {
  pathToValue: string;
  inputs: Param[];
  onSubmit: OnSubmitFn;
  className: string;
}

interface RenderInputByDataTypeProps {
  pathToValue: string;
  onSubmit: OnSubmitFn;
  param: Param;
  onRemoveCell?: () => void;
}

interface RenderObjectProps {
  pathToValue: string;
  param: Param;
  onSubmit: OnSubmitFn;
  label?: string;
  onRemoveCell?: () => void;
}

interface RenderArrayOfInputsProps {
  pathToValue: string;
  param: Param;
  onSubmit: OnSubmitFn;
  label: string;
}

interface ApplyNullValueButtonProps {
  value: any;
  pathToValue: string;
  onRemoveCell?: () => void;
}

interface ClearValueButtonProps {
  value: any;
  pathToValue: string;
  onRemoveCell?: () => void;
}

interface AddArrayCellProps {
  values: any[];
  pathToValue: string;
  param: Param;
}

interface RemoveArrayCellButtonProps {
  onRemoveCell?: () => void;
  className?: string;
  label?: string;
}

function AddArrayCell({ param, values, pathToValue }: AddArrayCellProps) {
  const { setParam } = useGlobalContext();

  if (!param.array) {
    return null;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-full ml-1 h-5 w-5 items-center justify-center flex self-center flex-shrink-0"
      onClick={() => {
        setParam({
          param,
          value: [...values, undefined],
          pathToValue,
        });
      }}
    >
      +
    </button>
  );
}

function RemoveArrayCellButton({
  onRemoveCell,
  className,
  label,
}: RemoveArrayCellButtonProps) {
  if (!onRemoveCell) {
    return null;
  }
  return (
    <Button
      outline
      className={`flex-initial flex-grow-0 ${className ? className : ""}`}
      onClick={onRemoveCell}
    >
      {label || "-"}
    </Button>
  );
}

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
        />
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
            className="mb-3"
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

function ClearValueButton({
  value,
  pathToValue,
  onRemoveCell,
}: ClearValueButtonProps) {
  const { setParam } = useGlobalContext();

  // If the value is not null, don't show a button to clear the value
  // Clear should show up after the value is null
  if (value !== null) {
    return null;
  }

  // We don't render the Clear button here because setting the value to undefined removes the array cell
  // from the UI, but the cell index is still present in the array and will still be submitted upon API Request.
  // Instead the user can choose to remove the cell or not, but not clear it
  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() =>
        setParam({
          value: undefined,
          pathToValue,
        })
      }
    >
      Clear
    </Button>
  );
}

function ApplyNullValueButton({
  value,
  pathToValue,
  onRemoveCell,
}: ApplyNullValueButtonProps) {
  const { setParam } = useGlobalContext();

  // If the value is already null or undefined, don't show a button to make the value null
  if (value === null || value === undefined) {
    return null;
  }

  // We can remove this guard if we want to support null values in arrays
  // but I found that this made the UI very busy
  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() =>
        setParam({
          value: null,
          pathToValue,
        })
      }
    >
      Null
    </Button>
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
  const { setParam, getFromRouteConfig } = useGlobalContext();
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
        ></InputLabelContainer>
      ) : null}
      <InputContainer>
        <Input
          value={value}
          label={label}
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
          value={value}
        />
        <ApplyNullValueButton
          onRemoveCell={onRemoveCell}
          pathToValue={pathToValue}
          value={value}
        />
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

// @todo (future) reFetch needs middleware support
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
        className="mb-3"
      />
    </div>
  );
}

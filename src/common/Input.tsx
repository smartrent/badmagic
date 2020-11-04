import React, { useEffect, SyntheticEvent } from "react";
import { map, startCase } from "lodash-es";

import { useGlobalContext } from "../context/Context";
import Label from "./Label";
import Required from "./Required";
import Select from "./Select";
import TextInput from "./TextInput";
import Button from "./Button";

import { Route, Param, ParamType } from "../types";

export default function Input({
  param,
  reFetch,
  route,
  paramType,
  parent,
}: {
  param: Param;
  route: Route;
  reFetch: () => void;
  paramType: ParamType;
  parent: null | string;
}) {
  const { setParam, getParam } = useGlobalContext();

  const label = param.label ? param.label : startCase(param.name);

  const value = getParam({ route, param, paramType, parent });

  const onChange = (value: any) =>
    setParam({ route, param, value, paramType, parent });

  useEffect(() => {
    setParam({ route, param, value, paramType, parent });
  }, []);

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      reFetch();
    }
  };
  let inputDOM;

  if (param.options && !!param.options.length) {
    inputDOM = (
      <Select
        onKeyDown={onKeyDown}
        onChange={(e: React.FormEvent<HTMLSelectElement>) => {
          const index = e.currentTarget.selectedIndex;
          let value = e.currentTarget.value;
          try {
            value =
              typeof param.options !== "undefined"
                ? param.options[index - 1].value
                : null;
          } catch (err) {}
          onChange(value);
        }}
        // allow value of false for boolean options
        value={value !== undefined && value !== null ? value : ""}
      >
        <option value="">Select One</option>
        {map(param.options, ({ label, value }) => {
          return (
            <option value={value} key={value}>
              {label || startCase(value)}
            </option>
          );
        })}
      </Select>
    );
  } else if (param.type === "textarea") {
    inputDOM = (
      <textarea
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
          onChange(e.currentTarget.value)
        }
        value={
          value
            ? typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : value
            : ""
        }
      />
    );
  } else {
    inputDOM = (
      <TextInput
        required={param.required}
        type={param.type || "text"}
        placeholder={value === null ? "(null)" : param.placeholder || label}
        onKeyDown={onKeyDown}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
        value={value ? value : ""}
      />
    );
  }

  return (
    <div className="my-8">
      <Label>
        {label} {param.required && <Required />}
      </Label>
      <div className="flex">
        {inputDOM}
        {typeof value !== "undefined" ? (
          <Button
            outline
            className="flex-shrink-0 ml-2"
            onClick={() =>
              setParam({
                route,
                param,
                value: undefined,
                paramType,
                parent: null,
              })
            }
          >
            Clear
          </Button>
        ) : (
          <Button
            outline
            className="flex-shrink-0 ml-2"
            onClick={() =>
              setParam({ route, param, value: null, paramType, parent: null })
            }
          >
            Null
          </Button>
        )}
      </div>
    </div>
  );
}

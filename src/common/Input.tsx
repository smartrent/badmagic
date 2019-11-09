import React, { useContext, useEffect } from "react";
import { map, startCase } from "lodash-es";

import Context from "../Context";
import Label from "./Label";
import Required from "./Required";

import { Route, Param, ParamType } from "../types";

export default function Input({
  param,
  reFetch,
  route,
  paramType,
}: {
  param: Param;
  route: Route;
  reFetch: () => void;
  paramType: ParamType;
}) {
  const { setParam, getParam } = useContext(Context);

  const label = param.label ? param.label : startCase(param.name);

  const value = getParam({ route, param, paramType });

  const onChange = (value: any) => setParam({ route, param, value, paramType });

  useEffect(() => {
    setParam({ route, param, value, paramType });
  }, []);

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      reFetch();
    }
  };
  let inputDOM;

  if (param.options && !!param.options.length) {
    inputDOM = (
      <div className="relative w-full">
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          onKeyDown={onKeyDown}
          onChange={(e) => {
            const index = e.currentTarget.selectedIndex;
            let value = e.currentTarget.value;
            try {
              value = param.options[index - 1].value;
            } catch (err) {}
            onChange(value);
          }}
          value={value ? value : ""}
        >
          <option value="">Select One</option>
          {map(param.options, ({ label, value }) => {
            return (
              <option value={value} key={value}>
                {label || startCase(value)}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  } else if (param.type === "textarea") {
    inputDOM = (
      <textarea
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        onChange={(e) => onChange(e.currentTarget.value)}
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
      <input
        type={param.type || "text"}
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        placeholder={param.placeholder || label}
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.currentTarget.value)}
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
        {value && (
          <button
            className="flex-shrink-0 bg-transparent hover:bg-gray-100 text-gray-600 px-2 border border-gray-500 ml-2 rounded"
            onClick={() => setParam({ route, param, value: null, paramType })}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

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
      <select
        onKeyDown={onKeyDown}
        onChange={(e) => {
          const index = e.currentTarget.selectedIndex;
          let value = e.currentTarget.value;
          try {
            value = param.options[index - 1].value;
          } catch (err) {
          }
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
    );
  } else if (param.type === "textarea") {
    inputDOM = (
      <textarea
        onChange={(e) => onChange(e.currentTarget.value)}
        value={
          value ? (typeof value === "object" ? JSON.stringify(value, null, 2) : value) : ""
        }
      />
    );
  } else {
    inputDOM = (
      <input
        type={param.type || "text"}
        placeholder={param.placeholder || label}
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.currentTarget.value)}
        value={value ? value : ""}
      />
    );
  }

  return (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
      <Label>
        {label} {param.required && <Required/>}
      </Label>
      {inputDOM}
      <button onClick={() => {
        setParam({ route, param, value: null, paramType });
      }}>Set Null
      </button>
    </div>
  );
}

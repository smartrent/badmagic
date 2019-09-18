import React, { useContext } from "react";
import { map, startCase } from "lodash-es";

import Context from "../Context";
import Label from "../common/Label";
import Required from "../common/Required";

import { Route, QSParam } from "../types";

export default function QSParams({
  route,
  reFetch,
}: {
  route: Route;
  reFetch: () => void;
}) {
  const { setQSParam, getQSParam } = useContext(Context);

  if (!(route.qsParams && route.qsParams.length)) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "8px",
      }}
    >
      {map(route.qsParams || [], (param: QSParam, idx) => {
        const label = param.label ? param.label : startCase(param.name);
        return (
          <div key={idx} style={{ marginTop: "4px", marginBottom: "4px" }}>
            <Label>
              {label} {param.required && <Required />}
            </Label>
            {!param.options && (
              <input
                type={param.type}
                placeholder={param.placeholder || label}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    reFetch();
                  }
                }}
                onChange={(e) => {
                  setQSParam({ route, param, value: e.currentTarget.value });
                }}
                value={getQSParam({ route, param })}
              />
            )}
            {param.options && !!param.options.length && (
              <select
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    reFetch();
                  }
                }}
                onChange={(e) => {
                  setQSParam({ route, param, value: e.currentTarget.value });
                }}
                value={getQSParam({ route, param })}
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
            )}
          </div>
        );
      })}
    </div>
  );
}

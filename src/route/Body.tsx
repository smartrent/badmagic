import React, { useContext } from "react";
import { map, startCase } from "lodash-es";

import Context from "../Context";
import Label from "../common/Label";
import Required from "../common/Required";

import { Route, BodyParam } from "../types";

export default function Body({
  route,
  reFetch,
}: {
  route: Route;
  reFetch: () => void;
}) {
  const { setBody, getBody } = useContext(Context);

  if (!(route.body && route.body.length)) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "8px",
      }}
    >
      {map(route.body || [], (param: BodyParam, idx) => {
        const label = param.label ? param.label : startCase(param.name);
        return (
          <div key={idx} style={{ marginTop: "4px", marginBottom: "4px" }}>
            <Label>
              {label} {param.required && <Required />}
            </Label>
            {!param.options && (
              <input
                type={param.type || "text"}
                placeholder={param.placeholder || label}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    reFetch();
                  }
                }}
                onChange={(e) => {
                  setBody({ route, param, value: e.currentTarget.value });
                }}
                value={getBody({ route, param })}
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
                  setBody({ route, param, value: e.currentTarget.value });
                }}
                value={getBody({ route, param })}
              >
                <option value="">Select One</option>
                {map(param.options, ({ label, value }) => {
                  return (
                    <option value={value} key={value}>
                      {label}
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

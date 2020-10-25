import React, { useState, useContext } from "react";
import { map } from "lodash-es";

import Label from "../common/Label";
import Context from "../Context";

export default function Headers({ headers }: { headers: any }) {
  const { darkMode } = useContext(Context);
  const [collapsed, setCollapsed] = useState(true);
  if (!headers) {
    return null;
  }

  return (
    <div className="mt-2">
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        <Label>Headers {collapsed ? "+" : "-"}</Label>
      </div>
      {!collapsed && (
        <div
          className={`${
            darkMode
              ? "text-gray-100 border-gray-700"
              : "text-gray-800 border-gray-300"
          } rounded text-xs p-2 border`}
          style={{
            overflowX: "scroll",
          }}
        >
          {map(headers, (value, name) => {
            return (
              <div key={name} style={{ marginBottom: "4px" }}>
                {name}: {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

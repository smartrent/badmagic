import React, { useState, useContext } from "react";
import { map } from "lodash-es";

import Label from "../common/Label";
import { useGlobalContext } from "../context/GlobalContext";

export default function Headers({ headers }: { headers: Record<string, any> }) {
  const { darkMode } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);
  if (!headers) {
    return null;
  }

  return (
    <div className="mt-2">
      <div onClick={() => setCollapsed(!collapsed)} className="cursor-pointer">
        <Label>Response Headers {collapsed ? "+" : "-"}</Label>
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

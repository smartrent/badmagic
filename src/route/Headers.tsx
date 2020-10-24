import React, { useState, useContext } from "react";
import { map } from "lodash-es";

import Label from "../common/Label";
import { useGlobalContext } from "../context/Context";

export default function Headers({ headers }: { headers: any }) {
  const { darkMode } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);
  if (!headers) {
    return null;
  }

  return (
    <div style={{ marginTop: "4px" }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        <Label>Headers {collapsed ? "+" : "-"}</Label>
      </div>
      {!collapsed && (
        <div
          className={darkMode ? "text-gray-100" : "text-gray-800"}
          style={{
            padding: "8px",
            border: "1px solid #eee",
            fontSize: "10px",
            overflowX: "scroll",
            maxWidth: "400px",
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

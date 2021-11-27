import React, { useState, useMemo, useCallback } from "react";
import { map } from "lodash-es";

import Label from "../Label";
import { useGlobalContext } from "../../context/GlobalContext";

export default function Headers({
  headers,
  label,
}: {
  headers: undefined | Record<string, any>;
  label: string;
}) {
  const { darkMode } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);
  const styles = useMemo(() => {
    return {
      headerContainer: darkMode
        ? "text-gray-100 border-gray-700"
        : "text-gray-800 border-gray-300",
    };
  }, [darkMode]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  if (!headers) {
    return null;
  }

  return (
    <div className="my-2">
      <div onClick={toggleCollapsed} className="cursor-pointer">
        <Label>
          {label} {collapsed ? "+" : "-"}
        </Label>
      </div>
      {!collapsed && (
        <div
          className={`${styles.headerContainer} rounded text-xs p-2 border`}
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

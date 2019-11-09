import React, { useContext, useState } from "react";
import { map } from "lodash-es";

import Context from "./Context";
import Label from "./common/Label";
import Helpers from "./lib/helpers";

export default function Environment() {
  const {
    environment,
    setEnvVar,
    deleteEnvVar,
    setDarkMode,
    darkMode,
  } = useContext(Context);
  const [collapsed, setCollapsed] = useState(true);
  const [newVarName, setNewVarName] = useState("");

  return (
    <div>
      <Label
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        Env {collapsed ? "+" : "-"}
      </Label>
      {!collapsed && (
        <div style={{ border: "1px solid #eee", padding: "16px" }}>
          <div
            style={{
              fontSize: "9px",
              cursor: "pointer",
              marginBottom: "8px",
              textAlign: "right",
            }}
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle Dark Mode
          </div>
          {map(environment, (value: string, key: string) => {
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  marginBottom: "4px",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ marginRight: "8px" }}>
                  <Label>Name</Label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    style={{ marginRight: "8px" }}
                    type="text"
                    readOnly
                    value={key}
                  />
                </div>
                <div style={{ marginRight: "8px" }}>
                  <Label>Value</Label>
                  <input
                    type="text"
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    value={value || ""}
                    onChange={(e) =>
                      setEnvVar({ key, value: e.currentTarget.value })
                    }
                  />
                </div>
                <div
                  style={{ cursor: "pointer", color: Helpers.colors.red }}
                  onClick={() => deleteEnvVar({ key })}
                >
                  -
                </div>
              </div>
            );
          })}
          <div>
            <Label>New Env Var</Label>
            <input
              type="text"
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={newVarName}
              onChange={(e) => setNewVarName(e.currentTarget.value)}
              style={{ marginRight: "4px" }}
            />
            <button
              onClick={() => {
                setEnvVar({ key: newVarName, value: "" });
                setNewVarName("");
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

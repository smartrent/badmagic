import React, { useContext } from "react";
import { map } from "lodash-es";

import Environment from "./Environment";
import Context from "./Context";
import Helpers from "./lib/helpers";
import { Workspace } from "./types";

export default function Workspaces() {
  const {
    workspaces,
    setWorkspaceName,
    workspace,
    darkMode,
    setRouteFilter,
    routeFilter,
  } = useContext(Context);
  return (
    <div
      style={{
        ...Helpers.getStyles(darkMode, "fixedHeader"),
        ...{
          width: "100%",
          position: "fixed",
          top: "0",
          right: "0",
          left: "0",
          zIndex: 1,
        },
      }}
    >
      <div
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Environment />
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "4px" }}>
            <select
              value={workspace && workspace.name ? workspace.name : ""}
              onChange={(e) => setWorkspaceName(e.currentTarget.value)}
            >
              <option value="">Select Workspace</option>
              {map(workspaces, (w: Workspace) => (
                <option value={w.name} key={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search Routes"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

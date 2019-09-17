import React, { useContext } from "react";
import { map } from "lodash-es";

import Context from "./Context";
import { Workspace } from "./types";

export default function Workspaces() {
  const { workspaces, setWorkspaceName, workspace } = useContext(Context);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "8px",
      }}
    >
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
  );
}

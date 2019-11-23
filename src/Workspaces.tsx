import React, { useContext } from "react";
import { map } from "lodash-es";

import Environment from "./Environment";
import Context from "./Context";
import { Workspace } from "./types";
import TextInput from "./common/TextInput";
import Select from "./common/Select";

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
      className={
        darkMode
          ? "bg-gray-900 w-full border-b border-gray-700 fixed top-0 right-0 left-0 z-10"
          : "bg-white w-full border-b border-gray-300 fixed top-0 right-0 left-0 z-10"
      }
    >
      <div className="w-full flex justify-between p-2">
        <div className="flex items-center">
          <a
            className="text-3xl leading-none mt-1"
            href="https://github.com/smartrent/badmagic"
          >
            🔮
          </a>
        </div>
        <div className="flex items-center">
          <div>
            <Select
              value={workspace && workspace.name ? workspace.name : ""}
              onChange={(e) => setWorkspaceName(e.currentTarget.value)}
            >
              <option value="">Select Workspace</option>
              {map(workspaces, (w: Workspace) => (
                <option value={w.name} key={w.name}>
                  {w.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="ml-2">
            <TextInput
              type="text"
              placeholder="Search Routes"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.currentTarget.value)}
            />
          </div>
          <div className="flex items-center ml-2">
            <Environment />
          </div>
        </div>
      </div>
    </div>
  );
}

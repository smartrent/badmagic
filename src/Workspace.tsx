import React, { useContext } from "react";
import { map, filter } from "lodash-es";

import Context from "./Context";
import Route from "./Route";
import ExportModal from "./common/ExportModal";

import { Route as RouteProps } from "./types";

export default function Workspace() {
  const { workspace, getWorkspaceSearchKeywords } = useContext(Context);
  if (!workspace) {
    return <div>Select a workspace to get started.</div>;
  }

  const allRoutes = workspace && workspace.routes ? workspace.routes : [];
  const filteredRoutes = filter(
    allRoutes,
    ({ name, path, sticky }: RouteProps) => {
      const keywords: string = getWorkspaceSearchKeywords();
      if (!keywords) {
        return true;
      }
      return (
        name.toLowerCase().includes(keywords.toLowerCase()) ||
        path.toLowerCase().includes(keywords.toLowerCase()) ||
        sticky
      );
    }
  );

  return (
    <div className="p-4 mt-12">
      {map(filteredRoutes, (r, idx) => {
        return (
          <Route key={`${r.method || "GET"}-${r.path}-${idx}`} route={r} />
        );
      })}

      <ExportModal />
    </div>
  );
}

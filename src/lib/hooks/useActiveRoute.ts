import { kebabCase } from "lodash-es";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useQueryString } from "./useQueryString";

import { useGlobalContext } from "../../context/GlobalContext";

export function useActiveRoute() {
  const { workspaces } = useGlobalContext();
  const { workspace: workspaceName }: Record<string, any> = useParams();

  const { method, path } = useQueryString();

  return useMemo(() => {
    const workspace = workspaces.find(
      (workspace) => kebabCase(workspace.name) === workspaceName
    );

    if (!workspace) {
      return null;
    }

    const route = workspace.routes.find(
      (route) => (route.method || "GET") === method && route.path === path
    );

    return route;
  }, [workspaceName, method, path, workspaces]);
}

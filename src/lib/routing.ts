import { kebabCase } from "lodash-es";
import { Route, Workspace } from "../types";

type RouteLookupFn = (
  workspaceId: string,
  method: string | undefined,
  path: string,
  name: string
) => Route | undefined;

export function routeLookupFactory(workspaces: Workspace[]): RouteLookupFn {
  const allRoutes = workspaces.reduce((acc, workspace) => {
    for (const route of workspace.routes) {
      const key = routeHref(workspace.id, route.method, route.path, route.name);

      if (acc[key]) {
        console.warn("Duplicate route config:", acc[key], route);
      }

      acc[key] = route;
    }

    return acc;
  }, {} as Record<string, Route>);

  return (workspaceId, method, path, name) => {
    const key = routeHref(workspaceId, method, path, name);
    return allRoutes[key] ?? undefined;
  };
}

export function routeHref(
  workspaceId: string,
  method: string | undefined,
  path: string,
  name: string
): string {
  return `/${workspaceId}/${method?.toLowerCase() ?? "get"}/${
    path.startsWith("/") ? path.substring(1) : path
  }/${kebabCase(name)}`;
}

export type EndpointRouteParams = {
  workspace: string;
  method: string;
  "*": string;
};

export function isEndpointRouteParams(
  params: Record<string, unknown>
): params is EndpointRouteParams {
  return "method" in params;
}

export function extractEndpointParams(params: EndpointRouteParams): {
  workspaceId: string;
  method: string;
  path: string;
  name: string;
} {
  const glob = params["*"].replace(/\/+$/, "");
  let splitIndex = glob.lastIndexOf("/");
  splitIndex = splitIndex < 0 ? glob.length : splitIndex;

  const path = glob.substring(0, splitIndex);
  const name = glob.substring(splitIndex);

  return {
    workspaceId: params.workspace,
    method: params.method,
    path,
    name,
  };
}

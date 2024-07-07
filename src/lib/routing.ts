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
  workspaceId: string;
  method: string;
  path: string;
  name: string;
};

export function extractEndpointParams(
  pathname: string,
  basename: string
): EndpointRouteParams | null {
  if (!pathname.startsWith(basename)) {
    throw new Error(
      `did not expect to handle popstate event outside of basename ${basename}, got: ${pathname}`
    );
  }

  pathname = pathname.substring(basename.length);
  const parts = pathname.split("/").flatMap((part) => (part ? [part] : []));

  if (parts.length < 4) {
    return null;
  }

  const workspaceId = parts.shift() as string;
  const method = parts.shift() as string;
  const name = parts.pop() as string;
  const path = `/${parts.join("/")}`;

  return { workspaceId, method, path, name };
}

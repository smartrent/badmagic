import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Layout } from "../layout/Layout";
import { Route } from "../types";

import { useGlobalContext } from "..";
import { useConfigContext } from "./ConfigContext";
import {
  extractEndpointParams,
  isEndpointRouteParams,
  routeHref,
  routeLookupFactory,
} from "../lib/routing";
import { getLinkedRouteFromUrl } from "../lib/links";

export function Router() {
  const { basename } = useConfigContext();

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: "/",
            element: (
              <RouteProvider>
                <Layout />
              </RouteProvider>
            ),
          },
          {
            path: "/:workspace/:method/*",
            element: (
              <RouteProvider>
                <Layout />
              </RouteProvider>
            ),
          },
        ],
        { basename }
      ),
    [basename]
  );

  return <RouterProvider router={router} />;
}

function RouteProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const { workspaces, setActiveRoute, storeHistoricResponse } =
    useGlobalContext();
  const navigate = useNavigate();

  const lookupRoute = useMemo(() => {
    return routeLookupFactory(workspaces);
  }, [workspaces]);

  useEffect(() => {
    if (!isEndpointRouteParams(params)) {
      setActiveRoute(null);
      return;
    }

    const { workspaceId, method, path, name } = extractEndpointParams(params);

    const activeRoute = lookupRoute(workspaceId, method, path, name);

    if (activeRoute) {
      setActiveRoute(activeRoute);
    }
  }, [params, lookupRoute, setActiveRoute]);

  // On initial mount, this will fetch HistoricResponse from local storage
  // and load any request that was deep linked
  useEffect(() => {
    const { route, historicResponse } = getLinkedRouteFromUrl({
      workspaces,
    });

    if (route?.workspaceId && historicResponse) {
      storeHistoricResponse(historicResponse);
      navigate(
        routeHref(route.workspaceId, route.method, route.path, route.name)
      );
    }
  }, [workspaces, storeHistoricResponse, navigate]);

  return <>{children}</>;
}

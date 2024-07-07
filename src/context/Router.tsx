import React, { ReactNode, useCallback, useEffect, useMemo } from "react";

import { Layout } from "../layout/Layout";

import { useGlobalContext } from "..";
import { useConfigContext } from "./ConfigContext";
import {
  extractEndpointParams,
  routeHref,
  routeLookupFactory,
} from "../lib/routing";
import { getLinkedRouteFromUrl } from "../lib/links";
import { Route } from "../types";

export function Router() {
  const { basename } = useConfigContext();
  const { workspaces, setActiveRoute } = useGlobalContext();

  const lookupRoute = useMemo(() => {
    return routeLookupFactory(workspaces);
  }, [workspaces]);

  useEffect(() => {
    const params = extractEndpointParams(location.pathname, basename ?? "");

    if (params) {
      const route = lookupRoute(
        params.workspaceId,
        params.method,
        params.path,
        params.name
      );
      if (route) {
        setActiveRoute(route);
      }
    } else {
      setActiveRoute(null);
    }

    const handlePathChange = (): void => {
      const params = extractEndpointParams(location.pathname, basename ?? "");
      console.log("handlePathChange", params);

      if (params) {
        const route = lookupRoute(
          params.workspaceId,
          params.method,
          params.path,
          params.name
        );
        if (route) {
          setActiveRoute(route);
        }
      } else {
        setActiveRoute(null);
      }
    };

    window.addEventListener("popstate", handlePathChange);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, [basename, lookupRoute, setActiveRoute]);

  return (
    <RouteProvider>
      <Layout />
    </RouteProvider>
  );
}

export function useNavigate() {
  const { basename } = useConfigContext();
  const { setActiveRoute } = useGlobalContext();

  return useCallback(
    (route: Route | null): void => {
      if (route) {
        history.pushState(
          null,
          "",
          `${basename ?? ""}${routeHref(
            route.workspaceId as string,
            route.method,
            route.path,
            route.name
          )}`
        );
      } else {
        history.pushState(null, "", basename ?? "");
      }

      setActiveRoute(route);
    },
    [basename, setActiveRoute]
  );
}

type NavLinkProps = {
  className: string | ((props: { isActive: boolean }) => string);
  to: Route | null;
  children: ReactNode;
};

export function NavLink({ className, to, children }: NavLinkProps) {
  const { basename } = useConfigContext();
  const { activeRoute } = useGlobalContext();
  const activeHref = useMemo(() => {
    if (!activeRoute) {
      return "/";
    }

    return routeHref(
      activeRoute.workspaceId as string,
      activeRoute.method,
      activeRoute.path,
      activeRoute.name
    );
  }, [activeRoute]);
  const linkHref = useMemo(() => {
    if (!to) {
      return "/";
    }

    return routeHref(to.workspaceId as string, to.method, to.path, to.name);
  }, [to]);

  const navigate = useNavigate();

  return (
    <a
      href={`${basename ?? ""}${linkHref}`}
      className={
        typeof className === "string"
          ? className
          : className({ isActive: activeHref === linkHref })
      }
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function RouteProvider({ children }: { children: ReactNode }) {
  const { workspaces, storeHistoricResponse } = useGlobalContext();
  const navigate = useNavigate();

  // On initial mount, this will fetch HistoricResponse from local storage
  // and load any request that was deep linked
  useEffect(() => {
    const { route, historicResponse } = getLinkedRouteFromUrl({
      workspaces,
    });

    if (route?.workspaceId && historicResponse) {
      storeHistoricResponse(historicResponse);
      navigate(route);
    }
  }, [workspaces, storeHistoricResponse, navigate]);

  return <>{children}</>;
}

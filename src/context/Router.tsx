import React, {
  AnchorHTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

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

export type NavigateFn = (
  route: Route | null,
  replace?: boolean | undefined
) => void;

export function useNavigate(): NavigateFn {
  const { basename } = useConfigContext();
  const { activeHref, setActiveRoute } = useGlobalContext();
  const activeHrefRef = useRef(activeHref);

  activeHrefRef.current = activeHref;

  return useCallback(
    (route, replace): void => {
      const href = routeHref(route, basename);

      const push =
        replace === undefined ? href !== activeHrefRef.current : !replace;

      if (push) {
        history.pushState({}, "", href);
      } else {
        history.replaceState({}, "", href);
      }

      [
        window,
        ...Array.from(document.querySelectorAll(".overflow-y-scroll")),
      ].forEach((scrollContainer) => {
        scrollContainer.scrollTo(0, 0);
      });

      setActiveRoute(route);
    },
    [basename, setActiveRoute]
  );
}

type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: Route | null;
  replace?: boolean | undefined;
  children: ReactNode;
  className: string;
  activeClassName?: string | undefined;
};

export function NavLink({
  to,
  children,
  className,
  activeClassName,
  onClick,
  replace,
  ...props
}: NavLinkProps) {
  const { basename } = useConfigContext();
  const { activeHref } = useGlobalContext();
  const linkHref = useMemo(() => routeHref(to, basename), [to, basename]);
  const navigate = useNavigate();

  return (
    <a
      href={linkHref}
      className={`${className}${
        activeClassName && activeHref === linkHref ? ` ${activeClassName}` : ""
      }`}
      onClick={(event) => {
        onClick?.(event);

        if (
          !event.isDefaultPrevented() &&
          (!props.target || props.target === "_self") &&
          !event.metaKey &&
          !event.ctrlKey
        ) {
          event.preventDefault();
          navigate(to, replace);
        }
      }}
      {...props}
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

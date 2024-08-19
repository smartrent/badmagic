import React, { useMemo } from "react";
import { get } from "lodash-es";

import helpers from "../../lib/helpers";
import { useGlobalContext } from "../../context/GlobalContext";

import { Route } from "../../types";
import { useCopyCurrentRoute } from "../../lib/links";

export function TopBar({
  route,
  urlParams,
  qsParams,
}: {
  route: Route;
  urlParams?: Record<string, any>;
  qsParams?: Record<string, any>;
}) {
  const { darkMode } = useGlobalContext();
  const pathWithQS = useMemo(() => {
    return helpers.buildPathWithQS({
      route,
      urlParams,
      qsParams,
    });
  }, [route, urlParams, qsParams]);

  const styles = useMemo(() => {
    return {
      methodContainer: darkMode ? "border-gray-700" : "border-gray-400",
      headerText: darkMode ? "text-gray-100" : "text-gray-800",
    };
  }, [darkMode]);

  const { copy, copied } = useCopyCurrentRoute({
    activeRoute: route,
    urlParams,
    qsParams,
  });

  if (!route) {
    return null;
  }

  const method = route.method || "GET";
  return (
    <div className="flex justify-start items-center mb-4">
      <div
        className={`w-16 flex flex-shrink-0 items-center justify-center text-xs text-gray-700 font-semibold p-1 mr-2 border rounded ${styles.methodContainer}`}
        style={{
          backgroundColor: get(helpers.colors.routes, method.toLowerCase()),
        }}
      >
        {method}
      </div>

      {route.deprecated && (
        <div className="flex flex-shrink-0 items-center justify-center text-xs text-white font-semibold p-1 mr-2 bg-red-700 rounded">
          DEPRECATED
        </div>
      )}

      <div
        className={`flex flex-grow-2 mr-auto gap-3 items-center cursor-pointer ${styles.headerText}`}
      >
        <div
          onClick={copy}
          className="cursor-pointer rounded hover:bg-gray-500 hover:bg-opacity-25 p-1"
        >
          {pathWithQS}
        </div>
        {copied ? <div className="text-green-500 text-sm">Copied!</div> : null}
      </div>

      <div
        className={`flex text-right ml-2 mr-1 items-center ${styles.headerText}`}
      >
        {route.name}
      </div>
    </div>
  );
}

import React, { useMemo, useState } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import ApiResponse from "./route/ApiResponse";
import ApiError from "./route/ApiError";
import BodyPreview from "./route/BodyPreview";
import { TopBar } from "./route/TopBar";
import Headers from "./route/Headers";
import Button from "./Button";

import { Route, HistoricResponse } from "../types";

export function History({ activeRoute }: { activeRoute?: Route }) {
  const { darkMode, historicResponses } = useGlobalContext();

  // If user is on the History page, don't collapse
  // If user is on on a Route page, collapse by default to improve page performance
  const [collapsed, setCollapsed] = useState(activeRoute ? true : false);

  // If `activeRoute` is specified, filter displayed History to records matching just that route
  const filteredHistory = useMemo(() => {
    if (!activeRoute) {
      return historicResponses;
    }

    return historicResponses.filter((historicResponse: HistoricResponse) => {
      return historicResponse.route?.name === activeRoute.name;
    });
  }, [historicResponses, activeRoute]);

  const styles = useMemo(() => {
    return {
      container: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
      headerText: darkMode ? "text-gray-100" : "text-gray-800",
    };
  }, [darkMode]);

  if (!filteredHistory?.length) {
    return null;
  }

  return (
    <div className={`p-4 border rounded ${styles.container}`}>
      <div className={`text-xl ${styles.headerText}`}>
        History ({filteredHistory.length})
      </div>

      {collapsed ? (
        <Button onClick={() => setCollapsed(false)} className="mt-4">
          Show
        </Button>
      ) : null}
      {collapsed
        ? null
        : filteredHistory.map(
            (
              {
                route,
                qsParams,
                urlParams,
                body,
                response,
                error,
              }: HistoricResponse,
              idx: number
            ) => (
              <div key={idx} className="my-4 border-t py-2">
                <TopBar
                  route={route}
                  darkMode={darkMode}
                  qsParams={qsParams}
                  urlParams={urlParams}
                />
                <BodyPreview body={body} />
                <ApiResponse response={response} />
                <ApiError error={error} />
                <Headers
                  headers={response?.config?.headers}
                  label="Request Headers"
                />
                <Headers
                  label="Response Headers"
                  headers={response?.headers || error?.response?.headers}
                />
              </div>
            )
          )}
    </div>
  );
}

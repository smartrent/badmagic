import React, { useMemo, useState } from "react";

import { useGlobalContext } from "../context/GlobalContext";
import Button from "./Button";
import { HistoricRecord } from "./HistoricRecord";

import { Route, HistoricResponse, HistoryMetadata } from "../types";

export function History({
  activeRoute,
  HistoryMetadata,
  filteredHistory,
}: {
  activeRoute?: Route;
  HistoryMetadata?: HistoryMetadata;
  filteredHistory: HistoricResponse[];
}) {
  const { darkMode } = useGlobalContext();

  // If user is on the History page, don't collapse
  // If user is on on a Route page, collapse by default to improve page performance
  const [collapsed, setCollapsed] = useState(activeRoute ? true : false);

  const styles = useMemo(() => {
    return {
      container: darkMode
        ? "bg-gray-900 border-gray-700"
        : "bg-gray-200 border-gray-400",
      headerText: darkMode ? "text-gray-100" : "text-gray-800",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);

  return (
    <>
      <div className={`p-4 border rounded ${styles.container}`}>
        <div className={`text-xl ${styles.headerText}`}>
          History ({filteredHistory.length})
        </div>

        {!filteredHistory.length ? (
          <div className={styles.textColor}>
            API requests and responses that you make will show up here.
          </div>
        ) : null}

        {filteredHistory.length && collapsed ? (
          <Button onClick={() => setCollapsed(false)} className="mt-4">
            Show
          </Button>
        ) : null}
        {collapsed
          ? null
          : filteredHistory.map((historicResponse: HistoricResponse) => (
              <HistoricRecord
                key={historicResponse.metadata.insertedAt}
                historicResponse={historicResponse}
                HistoryMetadata={HistoryMetadata}
              />
            ))}
      </div>
    </>
  );
}

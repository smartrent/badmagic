import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { useGlobalContext } from "../../context/GlobalContext";

export function Documentation({
  documentation,
}: {
  documentation: undefined | string;
}) {
  const { darkMode } = useGlobalContext();
  const styles = useMemo(() => {
    return {
      headerText: darkMode ? "text-gray-100" : "text-gray-800",
      documentationContainer: `px-4 mt-4 border rounded overflow-x-hidden ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-200 border-gray-300"
      }`,
    };
  }, [darkMode]);

  if (!documentation) {
    return null;
  }

  return (
    <div className={styles.documentationContainer}>
      <ReactMarkdown
        className={`badmagic-markdown ${darkMode ? "dark" : ""}`}
        source={documentation}
        escapeHtml={false}
      />
    </div>
  );
}

import React from "react";
import ReactMarkdown from "react-markdown";

import { useGlobalContext } from "../../context/GlobalContext";

export interface DocumentationProps {
  documentation?: string;
}

export function Documentation({ documentation }: DocumentationProps) {
  const { darkMode } = useGlobalContext();

  if (!documentation) {
    return null;
  }

  return (
    <div
      className={`px-4 mt-4 pb-4 border rounded overflow-x-hidden ${
        darkMode ? "bg-gray-900 border-gray-700" : "bg-gray-200 border-gray-300"
      }`}
    >
      <ReactMarkdown className={`badmagic-markdown ${darkMode ? "dark" : ""}`}>
        {documentation}
      </ReactMarkdown>
    </div>
  );
}

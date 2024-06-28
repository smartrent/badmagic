import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { useGlobalContext } from "../../context/GlobalContext";
import { CodeProps } from "react-markdown/lib/ast-to-react";

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
      <ReactMarkdown
        className={`badmagic-markdown ${darkMode ? "dark" : ""}`}
        components={{ code: CodeComponent }}
      >
        {documentation}
      </ReactMarkdown>
    </div>
  );
}

function CodeComponent({ children, className, node, ...rest }: CodeProps) {
  const { darkMode } = useGlobalContext();
  const match = /language-(\w+)/.exec(className || "");

  if (!match) {
    return (
      <code {...rest} className={className}>
        {children}
      </code>
    );
  }

  const [, language] = match;
  className += " highlighted";

  return (
    <SyntaxHighlighter
      {...rest}
      className={className}
      PreTag="div"
      language={language}
      style={darkMode ? materialDark : materialLight}
    >
      {children as string | string[]}
    </SyntaxHighlighter>
  );
}

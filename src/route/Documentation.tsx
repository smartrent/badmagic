import React from "react";

import ReactMarkdown from "react-markdown";

type Props = {
  documentation: string | undefined;
  darkMode: boolean;
};

export default ({ documentation, darkMode }: Props) => (
  <ReactMarkdown
    className={`badmagic-markdown ${darkMode ? "dark" : ""}`}
    source={documentation}
    escapeHtml={false}
  />
);

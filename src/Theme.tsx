import React, { useContext } from "react";

import Context from "./Context";
import Helpers from "./lib/helpers";

export default function Theme({ children }) {
  const { darkMode } = useContext(Context);

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        ...Helpers.getStyles(darkMode, "themeContainer"),
      }}
    >
      {children}
    </div>
  );
}

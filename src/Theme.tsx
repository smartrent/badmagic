import React, { useContext } from "react";

import Context from "./Context";

export default function Theme({ children }) {
  const { darkMode } = useContext(Context);

  return (
    <div
      className={
        darkMode ? "bg-gray-800 min-h-screen" : "bg-gray-100 min-h-screen"
      }
    >
      {children}
    </div>
  );
}

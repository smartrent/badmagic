import React from "react";

import { useGlobalContext } from "./context/Context";

export default function Theme({ children }: { children?: React.ReactNode }) {
  const { darkMode } = useGlobalContext();

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

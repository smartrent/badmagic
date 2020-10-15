import React, { useContext } from "react";

import Context from "./Context";

interface ThemeProps {children: React.ReactNode}

export default function Theme({ children }: ThemeProps) {
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

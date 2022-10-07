import React, { useMemo } from "react";

import { useGlobalContext } from "../../context/GlobalContext";
import Helpers from "../../lib/helpers";

export function ApiResponseStatus({ status }: { status: undefined | number }) {
  const { darkMode } = useGlobalContext();
  const styles = useMemo(() => {
    return {
      responseStatus: darkMode
        ? "bg-gray-700 border-gray-800"
        : "bg-gray-200 border-gray-400",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);

  const responseColor = useMemo(() => {
    if (status && status >= 200 && status < 300) {
      return Helpers.colors.green;
    } else if (status && status >= 400) {
      return Helpers.colors.red;
    }
  }, [status]);

  if (!status) {
    return null;
  }

  return (
    <div
      className={`flex-shrink-0 inline-flex text-xs font-bold border rounded self-start py-1 px-2 ${styles.responseStatus}`}
      style={{
        color: responseColor,
      }}
    >
      {status}
    </div>
  );
}

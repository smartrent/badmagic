import React, { useMemo } from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";

import { useGlobalContext } from "../../context/GlobalContext";
import Helpers from "../../lib/helpers";
import { ApiResponse } from "../../types";

export default function ApiResponse({
  response,
}: {
  response: null | ApiResponse;
}) {
  const { darkMode } = useGlobalContext();
  const styles = useMemo(() => {
    return {
      responseStatus: darkMode
        ? "bg-gray-800 border-gray-900"
        : "bg-gray-200 border-gray-400",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);
  const responseColor = useMemo(() => {
    if (response?.status && response.status >= 200 && response.status < 300) {
      return Helpers.colors.green;
    } else if (response?.status && response.status >= 400) {
      return Helpers.colors.red;
    }
  }, [response]);

  if (!response) {
    return null;
  }

  const isJSON = response.data && isObject(response.data);

  return (
    <div>
      {response?.status ? (
        <div
          className={`flex-shrink-0 inline-flex text-xs font-bold border rounded py-1 px-2 mb-1 ${styles.responseStatus}`}
          style={{
            color: responseColor,
          }}
        >
          {response.status}
        </div>
      ) : null}

      {response.data && isJSON && (
        <ReactJson
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
          src={response.data}
          theme={Helpers.reactJsonViewTheme(darkMode)}
          shouldCollapse={({ type, src, namespace, name }) => {
            // collapse anything more than 3 levels deep
            if (namespace.length > 3) {
              return true;
            }

            // collapse all but the first 5 elements of arrays
            if (Number(name) > 4) {
              return true;
            }

            // collapse arrays with more than 50 elements
            if (type === "array" && Array.isArray(src) && src.length > 50) {
              return true;
            }

            if (type === "object" && Object.keys(src).length > 50) {
              return true;
            }

            return false;
          }}
        />
      )}

      {response.data && !isJSON && (
        <div className={`border border-gray-400 p-2 ${styles.textColor}`}>
          {response.data}
        </div>
      )}
    </div>
  );
}

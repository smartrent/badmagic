import React from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";

import { useGlobalContext } from "../../context/GlobalContext";
import Helpers from "../../lib/helpers";

import { ApiError } from "../../types";

export default function ApiError({ error }: { error: null | ApiError }) {
  const { darkMode } = useGlobalContext();
  // const styles = useMemo(() => {
  //   return {
  //     responseStatus: darkMode
  //       ? "bg-gray-800 border-gray-900"
  //       : "bg-gray-200 border-gray-400",
  //     textColor: darkMode ? "text-white" : "",
  //   };
  // }, [darkMode]);
  if (!error?.response) {
    return null;
  }

  // let responseColor;
  // if (
  //   error?.response?.status &&
  //   error.response.status >= 200 &&
  //   error.response.status < 300
  // ) {
  //   responseColor = Helpers.colors.green;
  // } else if (error?.response?.status && error.response.status >= 400) {
  //   responseColor = Helpers.colors.red;
  // }

  const isJSON = error.response.data && isObject(error.response.data);

  return (
    <div>
      {error.response.data && isJSON && (
        <ReactJson
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
          src={error.response.data}
          theme={Helpers.reactJsonViewTheme(darkMode)}
        />
      )}

      {error.response.data && !isJSON && (
        <div
          className={`overflow-scroll text-clip border border-gray-400 p-2 ${
            darkMode ? "text-white" : ""
          }`}
        >
          {error.response.data}
        </div>
      )}
    </div>
  );
}

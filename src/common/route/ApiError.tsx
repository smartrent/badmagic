import React from "react";
import { isObject } from "lodash-es";
import ReactJson from "react-json-view";

import { useGlobalContext } from "../../context/GlobalContext";
import Helpers from "../../lib/helpers";

import { ApiError } from "../../types";

export default function ApiError({ error }: { error: null | ApiError }) {
  const { darkMode } = useGlobalContext();

  if (!error?.response) {
    return null;
  }

  const isJSON = error.response.data && isObject(error.response.data);

  return (
    <div>
      {error.response.data && isJSON && (
        <ReactJson
          enableClipboard={true}
          displayObjectSize={false}
          displayDataTypes={false}
          sortKeys
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

import React, { useContext } from "react";
import { get, isEmpty } from "lodash-es";
import ReactJson from "react-json-view";

import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";
import { Route } from "../types";

interface BodyPreviewProps {
  route: Route;
}

export default function BodyPreview({ route }: BodyPreviewProps) {
  const { routeConfig, darkMode } = useGlobalContext();

  const { body } = get(routeConfig, route.name, { body: {} });

  if (isEmpty(body)) {
    return null;
  }

  return (
    <div className="mb-4">
      <div
        className="flex-shrink-0 inline-flex text-xs font-bold bg-transparent mb-2"
        style={{
          ...Helpers.getStyles(darkMode, "label"),
        }}
      >
        Request Body
      </div>
      <ReactJson
        enableClipboard={false}
        displayObjectSize={false}
        displayDataTypes={false}
        src={{ ...body }}
        theme={darkMode ? "bright" : "rjv-default"}
      />
    </div>
  );
}

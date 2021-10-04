import React from "react";
import { isEmpty } from "lodash-es";
import ReactJson from "react-json-view";

import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";

interface BodyPreviewProps {
  body: Record<string, any>;
}

export default function BodyPreview({ body }: BodyPreviewProps) {
  const { darkMode } = useGlobalContext();

  if (isEmpty(body)) {
    return null;
  }

  return (
    <div className="mb-4">
      <div
        className="flex-shrink-0 inline-flex text-xs font-bold bg-transparent mb-1"
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
        theme={Helpers.reactJsonViewTheme(darkMode)}
      />
    </div>
  );
}

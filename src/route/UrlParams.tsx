import React, { useContext } from "react";
import { map } from "lodash-es";

import Label from "../common/Label";
import Required from "../common/Required";
import Context from "../Context";
import Helpers from "../lib/helpers";

import { Route } from "../types";

export default function UrlParams({
  route,
  reFetch,
}: {
  route: Route;
  reFetch: () => void;
}) {
  const { setUrlParam, getUrlParam } = useContext(Context);
  const urlParams = Helpers.getUrlParamsFromPath(route.path);
  if (!(urlParams && urlParams.length)) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "8px",
      }}
    >
      {map(urlParams, (urlParam, idx) => {
        return (
          <div key={idx} style={{ marginBottom: "4px" }}>
            <Label>
              {urlParam.label} <Required />
            </Label>
            <input
              type="text"
              placeholder={urlParam.label}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  reFetch();
                }
              }}
              onChange={(e) =>
                setUrlParam({ route, urlParam, value: e.currentTarget.value })
              }
              value={getUrlParam({ route, urlParam })}
            />
          </div>
        );
      })}
    </div>
  );
}

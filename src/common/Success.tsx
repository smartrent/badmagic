import React from "react";

import Helpers from "../lib/helpers";

export default function Success({ children }: { children: any }) {
  return children ? (
    <div style={{ color: Helpers.colors.green, fontSize: "14px" }}>
      {children}
    </div>
  ) : null;
}

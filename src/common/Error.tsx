import React from "react";

import Helpers from "../lib/helpers";

export default function Error({ children }: { children: React.ReactNode }) {
  return children ? (
    <div style={{ color: Helpers.colors.red, fontSize: "14px" }}>
      {children}
    </div>
  ) : null;
}

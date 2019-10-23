import React from "react";

import Helpers from "../lib/helpers";

export default function Required() {
  return <span style={{ color: Helpers.colors.red, fontSize: "14px" }}>*</span>;
}

import React from "react";

import Helpers from "../lib/helpers";

const Success: React.FC = ({ children }) => {
  return children ? (
    <div style={{ color: Helpers.colors.green, fontSize: "14px" }}>
      {children}
    </div>
  ) : null;
};

export default Success;

import React, { PropsWithChildren } from "react";

import Helpers from "../lib/helpers";

const Success: React.FC = ({ children }: PropsWithChildren<{}>) => {
  return children ? (
    <div style={{ color: Helpers.colors.green, fontSize: "14px" }}>
      {children}
    </div>
  ) : null;
};

export default Success;

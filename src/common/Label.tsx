import React, { useContext } from "react";

import Context from "../Context";
import Helpers from "../lib/helpers";

type Props = {
  children: any;
  onClick?: () => void;
  style?: Object;
};

export default function Label({ children, onClick, style }: Props) {
  const { darkMode } = useContext(Context);

  return (
    <div
      onClick={onClick}
      style={{ ...Helpers.getStyles(darkMode, "label"), ...(style || {}) }}
    >
      {children}
    </div>
  );
}

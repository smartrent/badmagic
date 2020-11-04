import React, { useContext } from "react";

import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";

type Props = {
  children: any;
  onClick?: () => void;
  style?: Object;
  size?: "xs" | "sm" | "lg" | "xl";
};

export default function Label({ children, onClick, style, size }: Props) {
  const { darkMode } = useGlobalContext();

  return (
    <div
      onClick={onClick}
      className={`block uppercase tracking-wide text-gray-700 text-${size ||
        "xs"} font-bold mb-1`}
      style={{ ...Helpers.getStyles(darkMode, "label"), ...(style || {}) }}
    >
      {children}
    </div>
  );
}

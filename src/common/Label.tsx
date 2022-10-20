import React from "react";

import { useGlobalContext } from "../context/GlobalContext";
import Helpers from "../lib/helpers";

import { Size } from "../types";

type Props = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  size?: Size;
  marginBottomClass?: string;
};

export default function Label({
  children,
  onClick,
  style,
  size,
  marginBottomClass,
}: Props) {
  const { darkMode } = useGlobalContext();

  return (
    <div
      onClick={onClick}
      className={`flex block uppercase tracking-wide text-gray-700 text-${
        size || "xs"
      } font-bold ${marginBottomClass ? marginBottomClass : "mb-1"}`}
      style={{ ...Helpers.getStyles(darkMode, "label"), ...(style || {}) }}
    >
      {children}
    </div>
  );
}

import React from "react";

import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";

import { Size, GenericObject } from "../types";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: GenericObject;
  size?: Size;
  marginBottom?: string;
};

export default function Label({
  children,
  onClick,
  style,
  size,
  marginBottom,
}: Props) {
  const { darkMode } = useGlobalContext();

  return (
    <div
      onClick={onClick}
      className={`flex block uppercase tracking-wide text-gray-700 text-${size ||
        "xs"} font-bold ${marginBottom ? marginBottom : "mb-1"}`}
      style={{ ...Helpers.getStyles(darkMode, "label"), ...(style || {}) }}
    >
      {children}
    </div>
  );
}

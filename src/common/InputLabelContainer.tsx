import React from "react";

import Label from "./Label";
import Required from "./Required";

import { Size } from "../types";

export function InputLabelContainer({
  label,
  children,
  required,
  size,
  marginBottomClass,
}: {
  label: string;
  children?: React.ReactNode;
  required?: boolean;
  size: Size;
  marginBottomClass?: string;
}) {
  return (
    <div className="flex items-center">
      <Label size={size || "lg"} marginBottomClass={marginBottomClass}>
        {label} {required && <Required />}
      </Label>
      {children}
    </div>
  );
}

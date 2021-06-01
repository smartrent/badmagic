import React from "react";

import Button from "./Button";

import { RemoveArrayCellButtonProps } from "../types";

export function RemoveArrayCellButton({
  onRemoveCell,
  className,
  label,
}: RemoveArrayCellButtonProps) {
  if (!onRemoveCell) {
    return null;
  }
  return (
    <Button
      outline
      className={`flex-initial flex-grow-0 ${className ? className : ""}`}
      onClick={onRemoveCell}
    >
      {label || "-"}
    </Button>
  );
}

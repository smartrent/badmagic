import React from "react";
import { set } from "lodash-es";

import Button from "./Button";

import { ApplyNullValueButtonProps } from "../types";

export function ApplyNullValueButton({
  value,
  pathToValue,
  onRemoveCell,
  values,
  setValues,
}: ApplyNullValueButtonProps) {
  // If the value is already null or undefined, don't show a button to make the value null
  if (value === null || value === undefined) {
    return null;
  }

  // We can remove this guard if we want to support null values in arrays
  // but I found that this made the UI very busy
  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() => setValues(set({ ...values }, pathToValue, null))}
    >
      Null
    </Button>
  );
}

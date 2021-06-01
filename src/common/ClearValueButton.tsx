import React from "react";

import { useGlobalContext } from "../context/Context";
import Button from "./Button";

import { ClearValueButtonProps } from "../types";

export function ClearValueButton({
  pathToValue,
  onRemoveCell,
  hidden,
}: ClearValueButtonProps) {
  const { setParam } = useGlobalContext();

  // If the value is not null, don't show a button to clear the value
  // Clear should show up after the value is null
  if (hidden) {
    return null;
  }

  // We don't render the Clear button here because setting the value to undefined removes the array cell
  // from the UI, but the cell index is still present in the array and will still be submitted upon API Request.
  // Instead the user can choose to remove the cell or not, but not clear it
  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() =>
        setParam({
          value: undefined,
          pathToValue,
        })
      }
    >
      Clear
    </Button>
  );
}

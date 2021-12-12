import React from "react";
import { set } from "lodash-es";

import { AddArrayCellProps } from "../types";

export function AddArrayCell({
  param,
  values,
  arrayOfValues,
  pathToValue,
  setValues,
}: AddArrayCellProps) {
  if (!param.array) {
    return null;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-full ml-1 h-5 w-5 items-center justify-center flex self-center flex-shrink-0"
      onClick={() => {
        setValues(
          set({ ...values }, pathToValue, [...arrayOfValues, undefined])
        );
      }}
    >
      +
    </button>
  );
}

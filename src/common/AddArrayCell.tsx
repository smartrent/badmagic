import React from "react";

import { useGlobalContext } from "../context/Context";

import { AddArrayCellProps } from "../types";

export function AddArrayCell({
  param,
  values,
  pathToValue,
}: AddArrayCellProps) {
  const { setParam } = useGlobalContext();

  if (!param.array) {
    return null;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-full ml-1 h-5 w-5 items-center justify-center flex self-center flex-shrink-0"
      onClick={() => {
        setParam({
          param,
          value: [...values, undefined],
          pathToValue,
        });
      }}
    >
      +
    </button>
  );
}

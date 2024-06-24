import React from "react";
import { set } from "lodash-es";

import Button from "./Button";

import { ApplyNowDateButtonProps } from "../types";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

export function ApplyNowDateButton({
  reference,
  pathToValue,
  onRemoveCell,
  values,
  setValues,
}: ApplyNowDateButtonProps) {
  const timeType = React.useMemo(() => {
    if (!reference) {
      return null;
    } else if (dateRegex.test(reference)) {
      return "date";
    } else if (timeRegex.test(reference)) {
      return "time";
    } else {
      return "dateTime";
    }
  }, [reference]);

  if (
    !reference ||
    !timeType ||
    (isNaN(Date.parse(reference)) &&
      isNaN(Date.parse(`1970-01-01T${reference}Z`)))
  ) {
    return null;
  }

  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() => setValues(set({ ...values }, pathToValue, now(timeType)))}
    >
      NOW
    </Button>
  );
}

function now(timeType: "date" | "time" | "dateTime") {
  const now = new Date().toISOString();
  switch (timeType) {
    case "date":
      return now.split("T")[0];
    case "time":
      return now.split("T")[1].split(".")[0];
    default:
      return now;
  }
}

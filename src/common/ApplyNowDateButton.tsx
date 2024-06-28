import React from "react";
import { cloneDeep, set } from "lodash-es";

import Button from "./Button";

import { ApplyNowDateButtonProps } from "../types";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z?$/;

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
    } else if (
      dateRegex.test(reference) &&
      !Number.isNaN(Date.parse(`${reference}T00:00:00Z`))
    ) {
      return "date";
    } else if (
      timeRegex.test(reference) &&
      !Number.isNaN(Date.parse(`1970-01-01T${reference}Z`))
    ) {
      return "time";
    } else if (
      dateTimeRegex.test(reference) &&
      !Number.isNaN(Date.parse(reference))
    ) {
      return "dateTime";
    } else {
      return null;
    }
  }, [reference]);

  if (!reference || !timeType) {
    return null;
  }

  if (onRemoveCell) {
    return null;
  }

  return (
    <Button
      outline
      className="flex-shrink-0 ml-1"
      onClick={() =>
        setValues(set(cloneDeep(values), pathToValue, now(timeType)))
      }
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

import React, { useState, useCallback, useEffect } from "react";

import Input from "../Input";
import { AddButton } from "../AddButton";
import Button from "../Button";
import { InputContainer } from "../InputContainer";
import { InputLabelContainer } from "../InputLabelContainer";

import { Param, ParamType } from "../../types";

export function AddCustomParam({
  customParams,
  setCustomParams,
  paramType,
}: {
  customParams: Param[];
  setCustomParams: (params: Param[]) => void;
  paramType: ParamType;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [param, setParam] = useState<null | Param>(null);

  let supportedInputTypes = [{ label: "Text", value: "text" }];

  if (paramType === "body") {
    supportedInputTypes = [
      ...supportedInputTypes,
      ...[
        { label: "Date", value: "date" },
        { label: "Datetime", value: "datetime" },
        { label: "Number", value: "number" },
        { label: "JSON", value: "json" },
      ],
    ];
  }

  useEffect(() => {
    // Rather than making the use select "Text" from a single-option dropdown menu, default to that
    if (paramType === "qsParams") {
      setParam({ name: "", type: "text" });
    }
  }, [paramType]);

  const onSubmit = useCallback(() => {
    if (param) {
      setCustomParams([...customParams, param]);
      // Same as above, don't reset the type for `qsParams` because that will require use to select `type: text`
      // from the dropdown
      setParam(paramType === "qsParams" ? { name: "", type: "text" } : null);
      setIsVisible(false);
    }
  }, [customParams, param, paramType, setCustomParams]);

  if (!isVisible) {
    return (
      <InputLabelContainer
        label="Add Custom Param"
        size="xs"
        marginBottomClass="mb-0"
      >
        <AddButton onClick={() => setIsVisible(true)} />
      </InputLabelContainer>
    );
  } else if (!param) {
    return (
      <>
        <InputLabelContainer label="Select Param Type" size="xs" />
        <Input
          options={supportedInputTypes}
          value=""
          label="Select Param Type"
          onChange={(type: string) => {
            const newParam: Param = { name: "" };
            if (type == "datetime") {
              // Using this placeholder will trigger the `Now` assist button to popup
              newParam.placeholder = new Date().toISOString();
            } else if (type == "json") {
              newParam.type = "textarea";
              newParam.defaultValue = `{"key": "value"}`;
              newParam.json = true;
            } else if (["text", "number", "date"].includes(type)) {
              newParam.type = type;
            }
            setParam(newParam);
          }}
        />
      </>
    );
  }

  return (
    <InputContainer className="items-end">
      <div>
        <InputLabelContainer label="Param Name" size="xs" />
        <Input
          value={param.name}
          label="Param Name"
          placeholder="some_variable"
          required={param.required}
          onChange={(name: string) => setParam({ ...param, name })}
          onSubmit={onSubmit}
        />
      </div>

      <div>
        <Button className="flex-grow-0 ml-1" onClick={onSubmit}>
          Add
        </Button>
      </div>
    </InputContainer>
  );
}

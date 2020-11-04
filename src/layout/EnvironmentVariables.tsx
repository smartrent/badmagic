import React, { useState } from "react";
import { map } from "lodash-es";

import { useGlobalContext } from "../context/Context";
import Label from "../common/Label";
import TextInput from "../common/TextInput";

// Icons
import Minus from "../common/icons/Minus";

export default function EnvironmentVariables() {
  const { environment, setEnvVar, deleteEnvVar, darkMode } = useGlobalContext();

  const [newVarName, setNewVarName] = useState("");
  const checkIfSubmitted = (e: KeyboardEvent) => {
    if (e && e.key === "Enter") {
      setEnvVar({ key: newVarName, value: "" });
      setNewVarName("");
    }
  };

  return (
    <div>
      <div
        className={`text-md mb-2 ${
          darkMode ? "text-gray-400" : "text-gray-800"
        }`}
      >
        Environment Variables
      </div>
      {map(environment, (value: string, key: string) => {
        return (
          <div key={key} className="flex items-end mb-2">
            <div className="mr-2">
              <Label>Name</Label>
              <TextInput type="text" readOnly value={key} />
            </div>
            <div className="mr-2">
              <Label>Value</Label>
              <TextInput
                type="text"
                value={value || ""}
                onChange={(e: React.FormEvent<HTMLInputElement>) =>
                  setEnvVar({ key, value: e.currentTarget.value })
                }
              />
            </div>
            <button
              className="mb-3" // Slight margin-bottom to faux-align with text inputs
              onClick={() => deleteEnvVar({ key })}
            >
              <Minus size={14} color={"#f56565"} />
            </button>
          </div>
        );
      })}

      <Label>New Env Var</Label>
      <div className="flex">
        <TextInput
          type="text"
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          value={newVarName}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setNewVarName(e.currentTarget.value)
          }
          onKeyDown={(e: KeyboardEvent) => checkIfSubmitted(e)}
          placeholder="Specify env name and press Enter to continue"
        />
      </div>
    </div>
  );
}

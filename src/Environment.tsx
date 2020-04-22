import React, { useContext, useState } from "react";

import Button from "./common/Button";
import Context from "./Context";
import Label from "./common/Label";
import TextInput from "./common/TextInput";

import { map } from "lodash-es";

export default function Environment() {
  const {
    environment,
    setEnvVar,
    deleteEnvVar,
    setDarkMode,
    darkMode,
    setExportModalShowing,
  } = useContext(Context);
  const [collapsed, setCollapsed] = useState(true);
  const [newVarName, setNewVarName] = useState("");

  const checkIfSubmitted = (e) => {
    if (e && e.key === "Enter") {
      setEnvVar({ key: newVarName, value: "" });
      setNewVarName("");
    }
  };

  return (
    <>
      <button
        className={darkMode ? "text-gray-300" : "text-gray-700"}
        onClick={() => setCollapsed(!collapsed)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="28"
          height="28"
        >
          <path
            fill="currentcolor"
            d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
          />
        </svg>
      </button>
      {!collapsed && (
        <div
          className={
            darkMode
              ? "absolute flex flex-col bg-gray-900 border border-gray-700 rounded p-2 z-10"
              : "absolute flex flex-col bg-white border border-gray-300 rounded p-2 z-10"
          }
          style={{ top: "0.25rem", right: "0.25rem" }}
        >
          <div className="flex self-end">
            <button
              className="text-gray-700 mt-1"
              onClick={() => setCollapsed(!collapsed)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
              >
                <path
                  fill="currentcolor"
                  d="M16.24 14.83a1 1 0 0 1-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 0 1-1.41-1.41L10.59 12 7.76 9.17a1 1 0 0 1 1.41-1.41L12 10.59l2.83-2.83a1 1 0 0 1 1.41 1.41L13.41 12l2.83 2.83z"
                />
              </svg>
            </button>
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
                    onChange={(e) =>
                      setEnvVar({ key, value: e.currentTarget.value })
                    }
                  />
                </div>
                <button
                  className="text-red-500 mb-1" // Slight margin-bottom to faux-align with text inputs
                  onClick={() => deleteEnvVar({ key })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                  >
                    <path
                      fill="currentcolor"
                      d="M17 11a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2h10z"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
          <div>
            <Label>New Env Var</Label>
            <div className="flex">
              <TextInput
                type="text"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                value={newVarName}
                onChange={(e) => setNewVarName(e.currentTarget.value)}
                onKeyDown={(e) => checkIfSubmitted(e)}
                placeholder="Specify env var name and press Enter to continue"
              />
            </div>
            <div
              className="flex mt-2 pt-2 border-t"
              style={{ flexDirection: "column" }}
            >
              <Button
                className="w-full"
                onClick={() => setDarkMode(!darkMode)}
                outline
                style={{ marginBottom: 8 }}
              >
                Toggle Dark Mode
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  setExportModalShowing(true);
                  setCollapsed(true);
                }}
                outline
              >
                Export Workspace
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

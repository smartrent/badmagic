import React, { useState } from "react";

import { useGlobalContext } from "../context/Context";
import Helpers from "../lib/helpers";
import Button from "../common/Button";

import EnvironmentVariables from "./EnvironmentVariables";

// Icons
import Cog from "../common/icons/Cog";
import DarkMode from "../common/icons/DarkMode";
import Download from "../common/icons/Download";
import Close from "../common/icons/Close";

export default function Config() {
  const { setDarkMode, darkMode, workspace } = useGlobalContext();
  const [collapsed, setCollapsed] = useState(true);

  const iconColor = darkMode ? "#eee" : "#333";

  return (
    <>
      <button onClick={() => setCollapsed(!collapsed)}>
        <Cog size={24} color={iconColor} />
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
              <Close size={14} color={iconColor} />
            </button>
          </div>
          <EnvironmentVariables />
          <div className="flex mt-3 pt-3 border-t">
            <Button
              className="w-full flex justify-center items-center"
              onClick={() => setDarkMode(!darkMode)}
              outline
            >
              <div className="mr-1">
                <DarkMode size={16} color={iconColor} />
              </div>
              <div>Dark Mode</div>
            </Button>
          </div>
          <div className="flex mt-3 pt-3 border-t">
            <Button
              className="w-full flex justify-center items-center"
              onClick={() => Helpers.downloadOpenApiJson({ workspace })}
            >
              <div className="mr-1">
                <Download size={16} color="#eee" />
              </div>
              <div>Download OpenAPI</div>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

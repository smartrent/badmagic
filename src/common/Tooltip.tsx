import React, { useState } from "react";
import HelpIcon from "../common/icons/Help";
import Tooltip from "rc-tooltip";

import { useGlobalContext } from "../context/GlobalContext";

export default function BadmagicTooltip({
  description,
}: {
  description: null | undefined | string;
}) {
  const { darkMode } = useGlobalContext();

  const [visible, setVisible] = useState(false);

  const onVisibleChange = () => {
    setVisible(!visible);
  };

  if (!description) {
    return null;
  }

  return (
    <div className="flex flex-grow justify-end">
      <Tooltip
        trigger={["hover"]}
        onVisibleChange={onVisibleChange}
        mouseLeaveDelay={0}
        overlayClassName="overlay"
        destroyTooltipOnHide={true}
        placement="top"
        overlay={
          <div
            className={`text-sm p-2 max-w-md text-center border rounded ${
              darkMode
                ? "bg-gray-900 border-gray-700 text-white"
                : "bg-gray-200 border-gray-300 text-black"
            }`}
          >
            {description}
          </div>
        }
      >
        <HelpIcon color="rgb(66, 153, 225" size={14} />
      </Tooltip>
    </div>
  );
}

import React, { useCallback, useState } from "react";
import HelpIcon from "../common/icons/Help";
import Tooltip from "rc-tooltip";

export default function BadmagicTooltip({param}: any) {
  if (!param.description) {
    return null;
  }

  const [visible, setVisible] = useState(false);

  const onVisibleChange = () => {
    setVisible(!visible)
  }

  return (
    <Tooltip 
    trigger={['hover']}
    onVisibleChange={onVisibleChange}
    mouseLeaveDelay={0}
    overlayClassName={"overlay"}
    destroyTooltipOnHide={true}
    placement={"top"}
    overlay={
          <div
            style={{
              width: 375
            }}
          >
            <p
            style={{
              fontSize: 12,
              textAlign: "center",
              lineHeight: 1.35,
              color: "white",
            }}
          >
            {param.description}
          </p>
          </div>
    }
    >
      <div style={{marginLeft: 10}}>
        <HelpIcon color="rgb(66, 153, 225" />
      </div>
    </Tooltip>
  );
}

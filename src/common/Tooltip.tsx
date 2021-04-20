import React, { useContext } from "react";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

export default function BadmagicTooltip({param}: any) {
  if (!param.description) {
    return null;
  }

  return (
    <Tooltip 
    title={param.description} 
    style={{ color: "rgb(66, 153, 225" }}
    >
      <IconButton>
        <HelpIcon />
      </IconButton>
    </Tooltip>
  );
}

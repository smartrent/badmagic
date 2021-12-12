import React from "react";
import Svg, { Path } from "svgs";

import { Icon } from "../../types";

const Minus = ({ size, color, ...props }: Icon) => (
  <Svg {...props} viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <Path d="M22.4803 12.5156H1.51965C1.23488 12.5156 1.00403 12.2848 1.00403 12C1.00403 11.7152 1.23488 11.4844 1.51965 11.4844H22.4803C22.765 11.4844 22.9959 11.7152 22.9959 12C22.9959 12.2848 22.765 12.5156 22.4803 12.5156Z" />
  </Svg>
);

Minus.displayName = "Minus";

Minus.defaultProps = {
  size: 24,
  color: "currentcolor",
};

export default Minus;

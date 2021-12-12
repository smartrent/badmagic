import React from "react";
import Svg, { Path } from "svgs";

import { Icon } from "../../types";

const Close = ({ size, color, ...props }: Icon) => (
  <Svg {...props} viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <Path d="M12.7294 12L21.0863 3.64269C21.2194 3.51307 21.2726 3.32183 21.2253 3.1421C21.1781 2.96237 21.0378 2.82198 20.8581 2.77461C20.6784 2.72725 20.4871 2.78024 20.3574 2.91332L12 11.2707L3.64269 2.91332C3.5124 2.78303 3.3225 2.73214 3.14452 2.77983C2.96654 2.82752 2.82752 2.96654 2.77983 3.14452C2.73214 3.3225 2.78303 3.5124 2.91332 3.64269L11.2707 12L2.91332 20.3574C2.78024 20.4871 2.72725 20.6784 2.77461 20.8581C2.82198 21.0378 2.96237 21.1781 3.1421 21.2253C3.32183 21.2726 3.51307 21.2194 3.64269 21.0863L12 12.7294L20.3574 21.0863C20.5602 21.2779 20.8787 21.2733 21.076 21.076C21.2733 20.8787 21.2779 20.5602 21.0863 20.3574L12.7294 12Z" />
  </Svg>
);

Close.displayName = "Close";

Close.defaultProps = {
  size: 24,
  color: "currentcolor",
};

export default Close;

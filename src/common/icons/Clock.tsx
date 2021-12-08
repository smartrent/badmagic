import React from "react";
import Svg, { Path } from "svgs";

import { Icon } from "../../types";

export const Clock = ({ size, color, ...props }: Icon) => (
  <Svg {...props} viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <Path d="M12.0028125,1.00875 C18.069375,1.00875 22.9875,5.926875 22.9875,11.9934375 C22.9875,18.06 18.069375,22.9776562 12.0028125,22.9776562 C5.93625,22.9776562 1.018125,18.0604687 1.018125,11.9934375 C1.018125,5.92640625 5.93625,1.00875 12.0028125,1.00875 Z M19.0410937,19.03125 C19.9501071,18.124439 20.6745823,17.0499042 21.174375,15.8671875 C23.1619262,11.1619962 21.2520347,5.71667767 16.7608857,3.28382629 C12.2697368,0.850974921 6.66536628,2.22582449 3.80997803,6.46090925 C0.954589771,10.695994 1.78153346,16.4069785 5.72092795,19.6581869 C9.66032245,22.9093953 15.4244855,22.6380949 19.0410938,19.03125 L19.0410937,19.03125 Z M12,2.983125 C12.2847718,2.983125 12.515625,3.21397818 12.515625,3.49875 L12.515625,12.0046875 C12.515625,12.2894593 12.2847718,12.5203125 12,12.5203125 L11.9957813,12.5203125 C11.8590116,12.5203125 11.7278272,12.466063 11.6310938,12.369375 L8.44359375,9.181875 C8.24681064,8.97971058 8.24903937,8.65693248 8.44859539,8.4575047 C8.64815141,8.25807693 8.97093088,8.25605572 9.17296875,8.45296875 L11.484375,10.764375 L11.484375,3.49875 C11.484375,3.21397818 11.7152282,2.983125 12,2.983125 Z M12,16.96875 C12.2847718,16.96875 12.515625,17.1996032 12.515625,17.484375 L12.515625,20.484375 C12.515625,20.7691468 12.2847718,21 12,21 C11.7152282,21 11.484375,20.7691468 11.484375,20.484375 L11.484375,17.484375 C11.484375,17.1996032 11.7152282,16.96875 12,16.96875 Z M6.5053125,11.484375 C6.79008432,11.484375 7.0209375,11.7152282 7.0209375,12 C7.0209375,12.2847718 6.79008432,12.515625 6.5053125,12.515625 L3.5053125,12.515625 C3.22054068,12.515625 2.9896875,12.2847718 2.9896875,12 C2.9896875,11.7152282 3.22054068,11.484375 3.5053125,11.484375 L6.5053125,11.484375 Z M20.5171875,11.484375 C20.8019593,11.484375 21.0328125,11.7152282 21.0328125,12 C21.0328125,12.2847718 20.8019593,12.515625 20.5171875,12.515625 L17.5171875,12.515625 C17.2324157,12.515625 17.0015625,12.2847718 17.0015625,12 C17.0015625,11.7152282 17.2324157,11.484375 17.5171875,11.484375 L20.5171875,11.484375 Z" />
  </Svg>
);

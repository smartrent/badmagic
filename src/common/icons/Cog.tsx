import React from "react";
import Svg, { Path } from "svgs";

import { Icon } from "../../types";

const Cog = ({ size, color, ...props }: Icon) => (
  <Svg {...props} viewBox="0 0 24 24" width={size} height={size} fill={color}>
    <Path d="M7.0298 11.9763C7.02972 9.2301 9.25581 7.00379 12.002 7.00362C14.7482 7.00345 16.9745 9.22948 16.9748 11.9757C16.9717 14.7206 14.7473 16.9451 12.0023 16.9482C9.25613 16.9486 7.02989 14.7225 7.0298 11.9763ZM12.0023 15.9174C14.179 15.9174 15.9436 14.1528 15.9436 11.9761C15.9415 9.80021 14.1782 8.03673 12.0023 8.0344C9.82561 8.03487 8.06105 9.79943 8.06105 11.9761C8.06105 14.1528 9.82561 15.9174 12.0023 15.9174Z M9.90511 22.9782H14.0995C14.6148 22.9802 15.0525 22.6015 15.1246 22.0913L15.4814 19.6013C15.9641 19.3781 16.4248 19.1099 16.8571 18.8002L19.2075 19.7442C19.6876 19.9325 20.233 19.7371 20.4843 19.2867L22.5801 15.6628L22.5862 15.6516C22.8351 15.2059 22.7248 14.6455 22.3256 14.3274L20.34 12.7749C20.3987 12.2435 20.3987 11.7073 20.34 11.176L22.3275 9.62206C22.7255 9.30367 22.8349 8.74415 22.5862 8.29925L22.5801 8.28847L20.4853 4.66409C20.2322 4.22244 19.6977 4.02744 19.2196 4.20237L19.2037 4.20847L16.86 5.14972C16.4274 4.83904 15.9657 4.57107 15.4814 4.34956L15.1246 1.85956C15.0523 1.34951 14.6146 0.971091 14.0995 0.973153H9.90511C9.38996 0.971091 8.95231 1.34951 8.87996 1.85956L8.52277 4.34956C8.04039 4.57319 7.57996 4.84139 7.14746 5.15065L4.79668 4.20706C4.31678 4.01902 3.77174 4.21418 3.52027 4.66409L1.42636 8.28659C1.16663 8.73327 1.27469 9.30293 1.67996 9.62347L3.66558 11.1764C3.60683 11.7076 3.60683 12.2437 3.66558 12.7749L1.67808 14.3288C1.28005 14.6472 1.1706 15.2067 1.41933 15.6516L1.42543 15.6628L3.51933 19.2867C3.77215 19.7287 4.30694 19.9238 4.78496 19.7485L4.8009 19.7424L7.14465 18.8011C7.57715 19.112 8.03885 19.3802 8.52324 19.6017L8.87996 22.0913C8.9521 22.6015 9.38981 22.9802 9.90511 22.9782ZM14.1032 21.9469H9.9009L9.50246 19.17C9.47653 18.989 9.35668 18.8353 9.18746 18.766C8.59539 18.521 8.03874 18.198 7.5323 17.8055C7.38766 17.6942 7.19495 17.6676 7.02558 17.7357L4.42824 18.7791C4.42405 18.7798 4.41977 18.7798 4.41558 18.7753L2.32308 15.1552C2.32013 15.1494 2.31899 15.1429 2.3198 15.1364L4.52808 13.4063C4.67048 13.2949 4.74412 13.117 4.72215 12.9375C4.67905 12.6187 4.65588 12.2974 4.65277 11.9757C4.65579 11.6533 4.67896 11.3314 4.72215 11.0119C4.74412 10.8324 4.67048 10.6546 4.52808 10.5432L2.3184 8.80456L4.42074 5.16706L7.02793 6.21425C7.19518 6.28138 7.38534 6.25632 7.52949 6.14815C8.03873 5.75743 8.59612 5.43384 9.18793 5.18534C9.35715 5.11604 9.477 4.96229 9.50293 4.78128L9.9009 2.00487H14.1056L14.504 4.78175C14.5299 4.96276 14.6498 5.11651 14.819 5.18581C15.4104 5.43044 15.9664 5.75298 16.4723 6.14487C16.6169 6.2562 16.8097 6.28276 16.979 6.21472L19.5759 5.17175C19.5802 5.17081 19.5847 5.17081 19.589 5.17597L21.6815 8.79847C21.6845 8.80441 21.6856 8.81109 21.6848 8.81768L19.4765 10.5446C19.3341 10.656 19.2605 10.8338 19.2825 11.0133C19.375 11.6525 19.375 12.3016 19.2825 12.9408C19.2605 13.1203 19.3341 13.2981 19.4765 13.4096L21.6848 15.1369C21.6856 15.1433 21.6845 15.1499 21.6815 15.1557L19.589 18.7758L19.5839 18.7842L16.9767 17.7371C16.8094 17.6699 16.6193 17.695 16.4751 17.8032C15.9658 18.1939 15.4085 18.5177 14.8167 18.7664C14.6475 18.8357 14.5276 18.9895 14.5017 19.1705L14.1032 21.9469Z" />
  </Svg>
);

Cog.displayName = "Cog";

Cog.defaultProps = {
  size: 24,
  color: "currentcolor",
};

export default Cog;

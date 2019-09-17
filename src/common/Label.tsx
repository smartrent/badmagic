import React from "react";

type Props = {
  children: any;
  onClick?: () => void;
  style?: Object;
};

export default function Label({ children, onClick, style }: Props) {
  return (
    <div
      onClick={onClick}
      style={{ color: "#555", fontSize: "11px", ...(style || {}) }}
    >
      {children}
    </div>
  );
}

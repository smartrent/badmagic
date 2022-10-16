import React from "react";

export function InputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-grow ${className ? className : ""}`}>
      {children}
    </div>
  );
}

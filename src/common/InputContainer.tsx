import React from "react";

export function InputContainer({
  children,
  className,
}: PropsWithChildren<{className?: string}>) {
  return (
    <div className={`flex flex-grow ${className ? className : ""}`}>
      {children}
    </div>
  );
}

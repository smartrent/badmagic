import React from "react";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...rest
}) => {
  return (
    <input
      className={
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-400 rounded py-2 px-3 leading-tight focus:outline-none focus:border-gray-500 " +
        className
      }
      {...rest}
    />
  );
};

export default Input;

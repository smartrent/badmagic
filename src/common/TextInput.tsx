import React from "react";

const Input = ({ className, ...rest }: any) => {
  return (
    <input
      className={
        "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 " +
        className
      }
      {...rest}
    />
  );
};

export default Input;

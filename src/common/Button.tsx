import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className, outline, ...rest }) => {
  return (
    <button
      className={
        outline
          ? "bg-transparent hover:bg-gray-100 text-gray-600 font-semibold py-2 px-4 border border-gray-500 rounded " +
            className
          : "bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded " +
            className
      }
      {...rest}
    />
  );
};

export default Button;

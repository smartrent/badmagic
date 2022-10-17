import React from "react";

export function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white text-xs rounded-full ml-1 h-5 w-5 items-center justify-center flex self-center flex-shrink-0"
      onClick={onClick}
    >
      +
    </button>
  );
}

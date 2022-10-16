import React from "react";
import { map } from "lodash-es";

import Select from "./Select";
import TextInput from "./TextInput";

export default function Input({
  label,
  value,
  options,
  placeholder,
  type,
  required,
  onChange,
  onSubmit,
}: {
  label: string;
  value: any;
  options?: { value: any; label?: string }[];
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (value: any) => void;
  onSubmit?: () => void;
}) {
  const onKeyDown = (e: any) => {
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  };
  let inputDOM;

  if (options && !!options.length) {
    inputDOM = (
      <Select
        onKeyDown={onKeyDown}
        onChange={(e: React.FormEvent<HTMLSelectElement>) => {
          const index = e.currentTarget.selectedIndex;
          let value = e.currentTarget.value;
          try {
            value =
              typeof options !== "undefined" ? options[index - 1].value : null;
          } catch (err) {
            // no-op
          }
          onChange(value);
        }}
        // allow value of false for boolean options
        value={value !== undefined && value !== null ? value : ""}
      >
        <option value="">Select One</option>
        {map(options, ({ label, value }) => {
          return (
            <option value={value} key={value}>
              {label || value}
            </option>
          );
        })}
      </Select>
    );
  } else if (type === "textarea") {
    inputDOM = (
      <textarea
        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-400 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-gray-200 focus:border-gray-500"
        onChange={(e: React.FormEvent<HTMLTextAreaElement>) =>
          onChange(e.currentTarget.value)
        }
        value={
          value
            ? typeof value === "object"
              ? JSON.stringify(value, null, 2)
              : value
            : ""
        }
      />
    );
  } else {
    inputDOM = (
      <TextInput
        required={required}
        type={type || "text"}
        placeholder={value === null ? "(null)" : placeholder || label}
        onKeyDown={onKeyDown}
        onChange={(e: React.FormEvent<HTMLInputElement>) =>
          onChange(e.currentTarget.value)
        }
        value={value ? value : ""}
      />
    );
  }

  return inputDOM;
}

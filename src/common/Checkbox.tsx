import React from "react";

const Checkbox = ({ type = "checkbox", name, checked = false, onChange }) => (
  <input
    className="mr-2 leading-tight"
    type={type}
    name={name}
    checked={checked}
    onChange={onChange}
  />
);

export default Checkbox;

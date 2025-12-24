// code-exec/fe-template/src/problems/checkbox-controlled-state/submission.jsx
import React from "react";

export default function AgreementCheckbox({ checked, onChange, label }) {
  function handleChange(e) {
    onChange && onChange(e.target.checked);
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        data-testid="agreement-checkbox"
      />
      {label}
    </label>
  );
}
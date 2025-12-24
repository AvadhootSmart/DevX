// code-exec/fe-template/src/problems/checkbox-controlled-state/boilerplate.jsx
import React, { useState } from "react";

export default function AgreementCheckbox({ checked, onChange, label }) {
  const [internal, setInternal] = useState(checked);

  function toggle() {
    setInternal(!internal);
    onChange && onChange(internal);
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={internal}
        onChange={toggle}
        data-testid="agreement-checkbox"
      />
      {label}
    </label>
  );
}
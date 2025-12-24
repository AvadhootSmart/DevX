// code-exec/fe-template/src/problems/search-input-debounce/boilerplate.jsx
import React, { useState } from "react";

export default function SearchInput({ onSearch, delay = 300 }) {
  const [value, setValue] = useState("");

  function handleChange(e) {
    setValue(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <input
      data-testid="search-input"
      value={value}
      onChange={handleChange}
      placeholder="Search"
    />
  );
}
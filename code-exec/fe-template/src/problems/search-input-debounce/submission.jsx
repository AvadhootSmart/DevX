// code-exec/fe-template/src/problems/search-input-debounce/submission.jsx
import React, { useEffect, useRef, useState } from "react";

export default function SearchInput({ onSearch, delay = 300 }) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay, onSearch]);

  return (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      aria-label="Search"
    />
  );
}
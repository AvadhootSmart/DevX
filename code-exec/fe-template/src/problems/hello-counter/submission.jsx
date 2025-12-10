import React from "react";
// index.tsx
function UserComponent() {
  const [count, setCount] = React.useState(null);
  const handleClick = () => {
    setCount((c) => c === null ? 1 : c + 1);
  };
  return /* @__PURE__ */ React.createElement("button", { onClick: handleClick, className: "bg-zinc-900 text-white px-2 py-2 rounded-md w-20 hover:bg-zinc-700 transition" }, count === null ? "Hello" : count);
}
export {
  UserComponent as default
};

import React from "react";

export const Badge = ({ count }: { count: number }) => {
  return (
    <div>
      Notifications
      {count > 0 && <span data-testid="badge">{count}</span>}
    </div>
  );
};

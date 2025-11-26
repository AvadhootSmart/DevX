import React from "react";

export const Card = () => (
  <div
    data-testid="card"
    style={{
      width: "300px",
      height: "200px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      background: "white",
      padding: "20px"
    }}
  >
    <h2>Card Title</h2>
    <p>Some content inside the card.</p>
  </div>
);

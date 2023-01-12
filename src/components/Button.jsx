import React from "react";

const Button = ({ onStart }) => {
  return (
    <div className="button">
      <button onClick={onStart}>start</button>
    </div>
  );
};

export default Button;

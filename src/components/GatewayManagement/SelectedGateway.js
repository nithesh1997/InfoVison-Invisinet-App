import React from "react";
import Gateway from "./Gateway";

export default function SelectedGateway(props) {
  return (
    <div
      style={{
        width: "80vw",
        backgroundColor: "#fff",
        borderRadius: "0.3rem",
      }}
    >
      <Gateway readableKey={props.readableKey} />
    </div>
  );
}

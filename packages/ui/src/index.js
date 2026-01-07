import React from "react";

export function Placeholder({ children }) {
  return <div className="p-2">{children ?? "UI Placeholder"}</div>;
}

export default {
  Placeholder,
};

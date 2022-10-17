import React from "react";

import { Guide } from "./types";

export function Guides({ guides }: { guides: Guide[] }) {
  return (
    <div>
      {guides.map((guide) => {
        return <div key={guide.label}>{guide.label}</div>;
      })}
    </div>
  );
}

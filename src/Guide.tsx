import React from "react";

import { Guide } from "./types";

export function Guide({ guide }: { guide: Guide }) {
  return (
    <div>
      <div>breadcrumbs here</div>
      {guide.documentation.map((doc, idx) => {
        return <div>{doc}</div>;
      })}
    </div>
  );
}

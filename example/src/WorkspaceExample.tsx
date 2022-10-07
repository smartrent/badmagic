import React from "react";

import { BadMagic } from "badmagic";

import { catWorkspace } from "./cat-workspace";
import { dogWorkspace } from "./dog-workspace";

export default function App() {
  return <BadMagic workspaces={[catWorkspace, dogWorkspace]} />;
}

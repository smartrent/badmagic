import React from "react";

import { BadMagic } from "badmagic";

import { dogWorkspace } from "./dog-workspace";

export default function App() {
  return <BadMagic workspaces={[dogWorkspace]} />;
}

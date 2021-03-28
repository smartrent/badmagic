import React from "react";

import { ContextProvider, Workspaces, Workspace, Theme } from "badmagic";

import { dogWorkspace } from "./dog-workspace";

export default function App() {
  return (
    <ContextProvider workspaces={[dogWorkspace]}>
      <Theme>
        <Workspaces />
        <Workspace />
      </Theme>
    </ContextProvider>
  );
}

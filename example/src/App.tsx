import React from "react";

import { ContextProvider, Workspaces, Workspace, Theme } from "badmagic";

import dogWorkspace from "./lib/dog-workspace";

export default function App() {
  const dogs = dogWorkspace;

  return (
    <ContextProvider workspaces={[dogs]}>
      <Theme>
        <Workspaces />
        <Workspace />
      </Theme>
    </ContextProvider>
  );
}

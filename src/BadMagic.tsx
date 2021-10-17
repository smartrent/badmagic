import React from "react";

import { ContextProvider } from "./context/Context";
import { Workspace } from "./types";
import { Layout } from "./layout/Layout";

export function BadMagic({ workspaces }: { workspaces: Workspace[] }) {
  return (
    <ContextProvider>
      <Layout workspaces={workspaces} />
    </ContextProvider>
  );
}

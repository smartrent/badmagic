import React from "react";

import { ContextProvider } from "./context/GlobalContext";
import { Layout } from "./layout/Layout";

import { BadMagicProps } from "./types";

export function BadMagic(props: BadMagicProps) {
  return (
    <ContextProvider workspaces={props.workspaces}>
      <Layout {...props} />
    </ContextProvider>
  );
}

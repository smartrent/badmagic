import React from "react";

import { ContextProvider } from "./context/GlobalContext";

import { BadMagicProps } from "./types";
import { ConfigProvider } from "./context/ConfigContext";
import { Router } from "./context/Router";

export function BadMagic(props: BadMagicProps) {
  return (
    <ConfigProvider config={props}>
      <ContextProvider>
        <Router />
      </ContextProvider>
    </ConfigProvider>
  );
}

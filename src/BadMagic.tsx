import React from "react";

import { ContextProvider } from "./context/GlobalContext";
import { Layout } from "./layout/Layout";

import { BadMagicProps, ApplyAxiosInterceptors } from "./types";
import { useShallowMemo, useStableCallback } from "./lib/hooks";
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

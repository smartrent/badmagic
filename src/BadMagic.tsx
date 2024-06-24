import React from "react";

import { ContextProvider } from "./context/GlobalContext";
import { Layout } from "./layout/Layout";

import { BadMagicProps, ApplyAxiosInterceptors } from "./types";
import { useShallowMemo, useStableCallback } from "./lib/hooks";

export function BadMagic(props: BadMagicProps) {
  const applyAxiosInterceptors = useStableCallback<ApplyAxiosInterceptors>(
    props.applyAxiosInterceptors,
    ({ axios }) => axios
  );

  const workspaces = useShallowMemo(props.workspaces);

  const config = useShallowMemo({
    ...props,
    workspaces,
    applyAxiosInterceptors,
  });

  return (
    <ContextProvider workspaces={props.workspaces}>
      <Layout {...config} />
    </ContextProvider>
  );
}

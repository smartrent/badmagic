import React, { ReactNode, createContext, useContext } from "react";
import { BadMagicProps } from "../types";
import { useShallowMemo } from "../lib/hooks";

const ConfigContext = createContext<BadMagicProps>(undefined as any);

type ConfigProviderProps = {
  config: BadMagicProps;
  children: ReactNode;
};

export function ConfigProvider({ config, children }: ConfigProviderProps) {
  const workspaces = useShallowMemo(config.workspaces);
  const context = useShallowMemo({ ...config, workspaces });

  return (
    <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>
  );
}

export function useConfigContext(): BadMagicProps {
  return useContext(ConfigContext);
}

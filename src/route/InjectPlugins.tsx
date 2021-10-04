import React from "react";
import { map, filter } from "lodash-es";

import { Route, Inject, Plugin, OnSubmitFn } from "../types";
import { useGlobalContext } from "../context/Context";

export default function InjectPlugins({
  inject,
  route,
  reFetch,
  children,
  loading,
  plugins,
  className,
  style,
}: {
  inject?: Inject;
  route: Route;
  reFetch: OnSubmitFn;
  children: React.ReactNode;
  loading: boolean;
  plugins: Plugin[];
  className?: string;
  style?: any;
}) {
  const context = useGlobalContext();
  const filteredPlugins = filter(plugins, { inject });

  if (!(filteredPlugins && filteredPlugins.length)) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={"flex flex-col overflow-hidden " + className} style={style}>
      {map(filteredPlugins, (plugin, idx) => {
        const Component = plugin.Component;
        return Component ? (
          <Component
            key={idx}
            plugin={plugin}
            context={context}
            route={route}
            reFetch={reFetch}
            loading={loading}
          />
        ) : null;
      })}
    </div>
  );
}

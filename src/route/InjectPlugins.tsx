import React, { useContext } from "react";
import { map, filter } from "lodash-es";

import { Route, Inject, Plugin } from "../types";
import Context from "../Context";

export default function InjectPlugins({
  inject,
  route,
  reFetch,
  style,
  children,
  loading,
  plugins,
  className,
}: {
  inject?: Inject;
  route: Route;
  reFetch: () => void;
  style: any;
  children: any;
  loading: boolean;
  plugins: Plugin[];
  className?: string;
}) {
  const context = useContext(Context);
  const filteredPlugins = filter(plugins, { inject });
  const styles = {
    margin: "8px",
    overflow: "hidden",
    ...(style || {}),
  };

  if (!(filteredPlugins && filteredPlugins.length)) {
    return (
      <div className={className} style={styles}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} style={styles}>
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

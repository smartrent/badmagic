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
}: {
  inject?: Inject;
  route: Route;
  reFetch: () => void;
  style: any;
  children: any;
  loading: boolean;
  plugins: Plugin[];
}) {
  const context = useContext(Context);

  const filteredPlugins = filter(plugins, { inject });

  if (!(filteredPlugins && filteredPlugins.length)) {
    return (
      <div style={{ marginTop: "8px", marginBottom: "8px", ...(style || {}) }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ marginTop: "8px", marginBottom: "8px", ...(style || {}) }}>
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

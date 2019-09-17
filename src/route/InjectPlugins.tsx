import React, { useContext } from "react";
import { map } from "lodash-es";

import Context from "../Context";

export default function InjectPlugins({
  injectAfter,
  route,
}: {
  injectAfter: "request" | "response";
  route: any;
}) {
  const context = useContext(Context);

  // Route plugins completely override workspace plugins
  // If Route plugins are not specified, this will default to workspace plugins
  const plugins =
    route.plugins && route.plugins.length
      ? route.plugins
      : context.workspace.plugins;

  return (
    <div style={{ marginTop: "8px", marginBottom: "8px" }}>
      {map(plugins, (plugin, idx) => {
        if (!(plugin.injectAfter && plugin.injectAfter === injectAfter)) {
          return null;
        }
        const Component = plugin.Component;
        return Component ? (
          <Component
            key={idx}
            plugin={plugin}
            context={context}
            route={route}
          />
        ) : null;
      })}
    </div>
  );
}

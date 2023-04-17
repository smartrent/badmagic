import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import { ContextProvider } from "./context/GlobalContext";
import { Layout } from "./layout/Layout";

import { Route as RouteDefinition } from "./Route";

import { BadMagicProps } from "./types";

export function BadMagic(props: BadMagicProps) {
  const { path } = useRouteMatch();

  return (
    <ContextProvider workspaces={props.workspaces}>
      <Layout {...props}>
        <Switch>
          <Route
            exact
            path={`${path}/workspaces/:workspace/routes`}
            render={() => (
              <RouteDefinition
                AuthForm={props.AuthForm}
                applyAxiosInterceptors={props.applyAxiosInterceptors}
                HistoryMetadata={props.HistoryMetadata}
              />
            )}
          />
        </Switch>
      </Layout>
    </ContextProvider>
  );
}

import React from "react";

import { ContextProvider, Workspaces, Workspace, Theme } from "badmagic";

const BASE_URL = `https://dog.ceo/api`;

export default function App() {
  const dogs = {
    id: "dogs",
    name: "Dogs",
    config: {
      baseUrl: BASE_URL,
    },
    plugins: [],

    routes: [
      {
        name: "Search Breeds",
        path: "/breeds/list/all",
      },

      {
        name: "View Random Breed Image",
        path: "/breed/:breed/images/random",
      },
    ],
  };

  return (
    <ContextProvider workspaces={[dogs]}>
      <Theme>
        <Workspaces />
        <Workspace />
      </Theme>
    </ContextProvider>
  );
}

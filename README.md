# Bad Magic

## General Usage

```javascript
import { ContextProvider, Workspaces, Workspace, Theme } from "badmagic";
import { Method } from "badmagic/dist/types";

export default function BadMagic() {
  const superheroes = {
    id: "superheroes",
    name: "Superheroes",
    config: {
      baseUrl: `${window.location.origin}/api`,
    },
    plugins: [],

    routes: [
      {
        name: "Search Superheroes",
        path: "/v1/superheroes",
      },

      {
        name: "Fetch Superhero",
        path: "/v1/superheroes/:superhero_id",
      },

      {
        name: "Create Superhero",
        path: "/v1/superheroes",
        method: Method.POST,
        body: [
          { name: "first_name", required: true },
          { name: "last_name" },
          { name: "phone", placeholder: "Some digits to reach this superhero" },
          { name: "superpowers", type: "textarea" },
          {
            name: "age",
            options: [
              { label: "6", value: 6 },
              { label: "18", value: 18 },
              { label: "60", value: 60 },
            ],
          },
        ],
      },

      {
        name: "Update Superhero",
        path: "/v1/superheroes/:superhero_id",
        method: Method.PATCH,
        body: [
          { name: "first_name", required: true },
          { name: "last_name" },
          { name: "phone", placeholder: "Some digits to reach this superhero" },
          { name: "superpowers", type: "textarea" },
          {
            name: "age",
            options: [
              { label: "6", value: 6 },
              { label: "18", value: 18 },
              { label: "60", value: 60 },
            ],
          },
        ],
      },

      {
        name: "Delete Superhero",
        path: "/v1/superheroes/:superhero_id",
        method: Method.DELETE,
      },
    ],
  };

  return (
    <ContextProvider workspaces={[superheroes]}>
      <Theme>
        <Workspaces />
        <Workspace />
      </Theme>
    </ContextProvider>
  );
}
```

## Plugins

`badmagic` supports plugins at the workspace level or plugins specific to routes. If plugins are specified for a route, they will override all plugins at the workspace level.

### Example

Here is an example `BearerAuth.tsx` plugin that will prompt the user to select a named access token from env vars that will then inject as an `Authorization` header with any routes that utilize this plugin:

```javascript
import React, { useState } from "react";
import { map, get, omitBy } from "lodash-es";

import { Success, Params } from "badmagic";
import { ParamType } from "badmagic/dist/types";

export default function BearerAuthorization({
  context,
  route,
  reFetch,
  loading,
}) {
  const { environment, routeConfig, setHeader } = context;
  if (!(route && route.name)) {
    return null;
  }
  const routeConfigVars = routeConfig[route.name];
  const bearerAuth = get(routeConfigVars, "headers.Authorization");
  const [success, setSuccess] = useState("");
  const envVars = omitBy(environment, (value, key) => !key.includes("Access"));

  return (
    <div>
      <Params paramType={ParamType.urlParams} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.body} reFetch={reFetch} route={route} />
      <Params paramType={ParamType.qsParams} reFetch={reFetch} route={route} />
      <select
        value={bearerAuth ? bearerAuth.replace("Bearer ", "") : ""}
        style={{ marginRight: "4px" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            reFetch();
          }
        }}
        onChange={(e) => {
          if (e.currentTarget.value) {
            setHeader({
              route,
              key: "Authorization",
              value: `Bearer ${e.currentTarget.value}`,
            });
            setSuccess("Authorization header set");
          } else {
            setHeader({
              route,
              key: "Authorization",
              value: "",
            });
            setSuccess("");
          }
        }}
      >
        <option value="">Select Authorization</option>
        {map(envVars, (value, key) => (
          <option key={key} value={value}>
            {key.replace("Access - ", "")}
          </option>
        ))}
      </select>
      <Success>{success}</Success>
      <button disabled={loading} onClick={reFetch}>
        {loading ? "Loading..." : "Try"}
      </button>
    </div>
  );
}
```

Usage:

```javascript
const superheroes = {
    id: "superheroes",
    name: "Superheroes",
    config: {
      baseUrl: `${window.location.origin}/api`,
    },
    plugins: [
    {
      Component: BearerAuthorization,
      inject: Inject.asRequest,
    },
  ],,

    routes: [
      {
        name: "Search Superheroes",
        path: "/v1/superheroes",
      },

      {
        name: "Fetch Superhero",
        path: "/v1/superheroes/:superhero_id",
      },

      {
        name: "Create Superhero",
        path: "/v1/superheroes",
        method: Method.POST,
        body: [
          { name: "first_name", required: true },
          { name: "last_name" },
          { name: "phone", placeholder: "Some digits to reach this superhero" },
          { name: "superpowers", type: "textarea" },
          {
            name: "age",
            options: [
              { label: "6", value: 6 },
              { label: "18", value: 18 },
              { label: "60", value: 60 },
            ],
          },
        ],
      },

      {
        name: "Update Superhero",
        path: "/v1/superheroes/:superhero_id",
        method: Method.PATCH,
        body: [
          { name: "first_name", required: true },
          { name: "last_name" },
          { name: "phone", placeholder: "Some digits to reach this superhero" },
          { name: "superpowers", type: "textarea" },
          {
            name: "age",
            options: [
              { label: "6", value: 6 },
              { label: "18", value: 18 },
              { label: "60", value: 60 },
            ],
          },
        ],
      },

      {
        name: "Delete Superhero",
        path: "/v1/superheroes/:superhero_id",
        method: Method.DELETE,
      },
    ],
  };
```

## Questions

> Why did you name this `badmagic`?

Right before a production deploy, I was contemplating an easy to implement API interface that can be consumed by engineers during local testing and by QA teams during the QA phase of the SDLC and is pluggable. As the deploy was kicked off, my Macbook crashed and when I rebooted, my crash report said "Bad magic! Kernel panic!" and in that moment, the package name had been decided.

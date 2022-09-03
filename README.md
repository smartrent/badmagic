# 🔮 Bad Magic

Bad Magic is a Swagger-UI alternative that allows developers to visualize and test their API resources from a convenient web interface.

<img src="./demo-screenshot.png" alt="Demo screenshot of Bad Magic">

## Installation

```
yarn add badmagic
```

**You will also need to include the TailwindCSS stylesheet on the page you plan to use Bad Magic**

```html
<link
  href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
  rel="stylesheet"
/>
```

## Badmagic Example

Clone `badmagic`, then run the following commands:

- `cd example`
- `yarn`
- `yarn start`

### Testing Locally

#### Terminal Window 1

In the `root badmagic directory` run the following commands:

- `yarn`
- `yarn link`
- `yarn start`

#### Terminal Window 2

In the `example directory` run the follow commands:

- `yarn` to install node modules in the example folder
- `yarn link "badmagic"`
- `yarn start` (to start the example that will be running on port 3000 by default)

## General Usage

```javascript
import { BadMagic } from "badmagic";
import { Method } from "badmagic/dist/types";

export function BadMagicClient() {
  const superheroWorkspace = {
    id: "superheroes",
    name: "Superheroes",
    config: {
      baseUrl: `${window.location.origin}/api`,
    },
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
        method: "POST",
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
        method: "PATCH",
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
        method: "DELETE",
      },
    ],
  };

  return (
    <BadMagic workspaces={[superheroWorkspace]} />
  );
}
```

## Axios Interceptors

`badmagic` uses Axios as the API library and Axios has [Interceptors](https://axios-http.com/docs/interceptors) which make it easy to intercept requests or responses to do tasks like injecting auth headers.

### Injecting Auth Headers

Here is an example of injecting a Bearer auth header where the function `getAccessToken()` is a way on your frontend to fetch the current user's access token.

```jsx
export const applyAxiosInterceptors = ({ axios }) => {
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    };
  });

  return axios;
};
```

Usage:

```jsx
<BadMagic
  applyAxiosInterceptors={applyAxiosInterceptors}
  workspaces={workspaces}
/>
```

#### Adding AuthForm

If needed, you can prompt the end-user to enter auth credentials and/or to generate access tokens, etc., by using a
form that can be injected and rendered above the `Route` component called `AuthForm`.

`workspaceConfig` is passed in as an argument so if you have multiple workspaces with different auth strategies, you
can use the information in `workspaceConfig` to determine which form to render.

Here's some pseudocode to give you an idea:

```jsx
export function AuthForm({
  workspaceConfig,
}) {
  return (
    <div>
      <TextInput name="email" />
      <TextInput name="password" />
      <Button onClick={() => {
        // axios request to login user, fetch access token, and store access token in state or local storage
        // then in the `applyAxiosInterceptors`, the `getAccessToken()` function can fetch the token from state or 
        // local storage
      }}>
    </div>
  );
};
```

Usage:

```jsx
<BadMagic
  AuthForm={AuthForm}
  applyAxiosInterceptors={applyAxiosInterceptors}
  workspaces={workspaces}
/>
```

### Prepending Request/Response To History

`badmagic` can also use Axios Interceptors to intercept the response to append the request/response to local storage
so that you can see prior API requests you made.

Here's an example:

```jsx
export const applyAxiosInterceptors = ({ axios, storeHistoricResponse }) => {
  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      storeHistoricResponse({
        metadata: getMetadata() // Metadata can store any data you want like which access token was used, etc.
        response,
        error: null,
      }); // Adds success response to BadMagic's `History` tab
      return response;
    },
    (error: AxiosError) => {
      storeHistoricResponse({
        metadata: getMetadata() // Metadata can store any data you want like which access token was used, etc.
        response: null,
        error,
      }); // Adds error response to BadMagic's `History` tab
      return Promise.reject(error);
    }
  );

  return axios;
};
```

Usage:

```jsx
<BadMagic
  applyAxiosInterceptors={applyAxiosInterceptors}
  workspaces={workspaces}
/>
```

#### Displaying Metadata

`badmagic` allows rendering a custom subsection in the `History` section for each historic API request where you can
take the `metadata` you stored using the axios intercepter and display it in any custom way you'd like.

Note: By default, `insertedAt` is stored on `metadata`.

Example:

```jsx
export function HistoryMetadata({
  metadata,
}: {
  metadata: Record<string, any>;
}) {
  if (!metadata?.accessToken) {
    return null;
  }

  return (
    <div className="flex justify-between">
      <div>Access Token: {metadata.accessToken}</div>
      <div>{new Date(metadata.insertedAt).toLocaleString()}</div>
    </div>
  );
}
```

Usage:

```jsx
<BadMagic
  HistoryMetadata={HistoryMetadata}
  applyAxiosInterceptors={applyAxiosInterceptors}
  workspaces={workspaces}
/>
```

## Route Documentation

- Each route can specify documentation by adding a `documentation` key to the object.
- `documentation` accepts a string literal template that will render into markdown
- Styling
  - Your own styles can be applied to the markdown by prefixing the styles with `.badmagic-markdown`
  - Alternatively, you can import BadMagic's stylesheet for default styling:
    ```html
    <link
      href="https://unpkg.com/badmagic@^0.0.16/dist/css/markdown.min.css"
      rel="stylesheet"
    />
    ```

Usage:

```jsx
import SuperHero Documentation from "./docs/superheroes.md";

const superheroes = {
  id: "superheroes",
  name: "Superheroes",
  config: {
    baseUrl: `${window.location.origin}/api`,
  },
  routes: [
    {
      name: "Search Superheroes",
      path: "/v1/superheroes",
      documentation: SuperHeroDocumentation,
    },
    {
      name: "Fetch Superhero",
      path: "/v1/superheroes/:superhero_id",
    },
  ],
};
```

## Route Deprecation
- Each route can specify its deprecation status by adding a `deprecated` key to the object.
- `deprecated` accepts a boolean and will by default is set to `false`

Usage:

```javascript
const superheroes = {
  id: "superheroes",
  name: "Superheroes",
  routes: [
    {
      name: "Fetch Superhero",
      path: "/v1/superheroes/:superhero_id",
      deprecated: true
    },
  ],
};
```

## Input Field Tooltip
- Each input type can have a tooltip hover to describe what the input field is expecting if the name is ambiguous.
- The existence of a `description` attribute will generate the on-hover icon and it will pull the text from the `description` as well

Usage:

```javascript
const superheroes = {
  id: "superheroes",
  name: "Superheroes",
  routes: [
    {
        name: "Update Superhero",
        path: "/v1/superheroes/:superhero_id",
        method: "PATCH",
        body: [
          { 
            name: "first_name",
            required: true,
            description: "The first name of the hero you want to update to"
          },
      },
  ],
};
```

## Questions

> Why did you name this `badmagic`?

Right before a production deploy, I was contemplating an easy to implement API interface that can be consumed by engineers during local testing and by QA teams during the QA phase of the SDLC and is pluggable. As the deploy was kicked off, my Macbook crashed and when I rebooted, my crash report said "Bad magic! Kernel panic!" and in that moment, the package name had been decided.

## Local Testing

The below assumes you have `wml` installed:

- `yarn` to get dependencies for `badmagic`
- In one terminal window with `badmagic` in the CWD run `wml add . ../path/to/your/project/node_modules/badmagic`
- Then in that same window run `wml start`
- In a second terminal window with `badmagic` in the CWD run `yarn start`
- Restart the frontend of your project. Now anytime you save a file in this project it will get applied to your other project that had `badmagic` installed

Running the `example` in your browser:

- In one terminal window run in the `badmagic` root folder, run `yarn` then `yarn link` then `yarn start`
- In another terminal window in the `example` folder, run `yarn`, then `yarn link badmagic` then `yarn start`

## Publishing A New Version

- Run `yarn publish`

## Resources

[OpenAPI](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md)

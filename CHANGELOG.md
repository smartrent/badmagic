# Changelog


## v0.0.32

### Features 

- If your param's placeholder is an ISO timestamp, a date or a time, a `NOW` button shows up to the right of the input and populates the input with the current UTC value when clicked
- Under the config menu there is a new `Hide Deprecated Routes` option to filter out routes that are deprecated when applied

## v0.0.31

- Upgrade `react-markdown` to ^7

## v0.0.30

### Bugfixes

- Upgrade `@smartrent/use-axios` to 2.0.0

## v0.0.29

Note: v0.0.29 had a dependency bug with `@smartrent/use-axios`, please use v0.0.30

v0.0.29 is a partial rewrite of `badmagic` with significant changes to the implementation. It's designed to be
easier to implement and reduced complexity with hooking into `axios` by using it's `interceptor`. See `README` for
example usage.

There's likely additional work that needs to be done in future versions with css styles and
potentially bugfixes from the rewrite.

### Features

- Adds new `History` section to see previous api requests and responses
- Simplifies implementation and simplifies badmagic codebase
- Adds support for `applyAxiosInterceptors`, `AuthForm` (which renders above the `Route` component), and `HistoryMetadata` (which renders at the bottom of each `HistoricRecord` component)

### Breaking Changes

There are a lot of breaking changes in this version upgrade. A few of the major ones are listed below, but
refer to the `README` to see how usage guidelines and examples.

- Removes the `plugins` system. See `Readme` for information on how to convert from `plugins` to using `AuthForm` and `applyAxiosInterceptors`
- Removes the `EnvVar` system. It wasn't being used except for Auth Profiles which are now handled outside of BadMagic through interceptors
- Removes support for `sticky` attribute on a route
- Removes most of the exports from `badmagic` including `Layout`, `Theme`, `ContextProvider`, `Workspaces` and `Workspace`
- Request param values are no longer stored in local storage

## v0.0.28

### Bugfixes

- Ensure Workspace selected before initializing routes in local storage. Fixes bug where application would freeze if no workspace selected

### Enhancements

- Improved TS definitions

## v0.0.27

### Bugfixes

- Cleanup TypeScript definitions when the plugin system is being used so TS errors aren't thrown

## v0.0.26

### Features

- If a `Param` has a `description`, it will render an info question mark to help provide more information to the end-user.
- A previous version added support for `nullable: true` for the OpenAPI spec when downloading JSON. Now the badmagic UI respects that and won't show the `Null` button if a field can't be nullable
- Before a network request is submitted by the end user, badmagic now validates that the `URL Params` all have values using `Yup`. If they don't the request fails with validation errors. Note: We are planning on adding support for validating `body` params in the future but for now, even though they can be marked as required and the red asterisk shows up, badmagic will allow the network request to continue.

### Bugfixes

- URL Params are always required but a previous iteration caused URL Params to lose the red asterisk indicating it was required. This has been added back.
- New routes weren't showing up if local storage wasn't cleared for that workspace (presumed fixed in 0.0.24 but there were instances where this was still occurring). Workspace initialization (including all of a workspace's routes) has been moved to Workspace.tsx from Route.tsx. The problem was that we were writing to localstorage asynchronously so sometimes routes that were being initialized were clobbering other routes that has been just saved to local storage, causing them not to render. This also should improve performance because Route.tsx should generally have less re-renders.

### Enhancements

- Improved Typescript specifications in many areas
- Misc. cleanup on components to break them apart more
- Uses `useMemo` and `useCallback` in a few areas to improve performance

## v0.0.25

### Features

- If `deprecated: true` is specified for a route, it will show a deprecated tag in the UI for that route
- Autocollapse portions of large json response to improve rendering performance

## v0.0.24

### Bugfixes

- New routes weren't showing up if local storage wasn't cleared for that workspace
- Select dropdowns were inadvertently changed to text inputs

## v0.0.23

### Features

- Adds array support for a Param by specifying `{array: true}` in the options

### Bugfixes

- `defaultValue` is now of type `any` from type `string`
- Allow falsy values in query string (values are omitted if they are undefined)

## Enhancements

- Upgrades `axios` to `0.21.1` to patch a security vulnerability

## v0.0.22

### Features

- Adds `useGlobalContext` as well as `OpenApi` to exports
- Adds support for `Download OpenApi` json
  - If OpenApi specs are not passed in, OpenApi JSON is derived from the workspace information. Note: Badmagic cannot derive responses

### Bugfixes

- Fixes a bug where if `setEnvVar` was called twice in a row, the first set of changes would be lost
- Fixes a bug where new routes were showing `0` in the response section

### Enhancements

- Adds `Jest` for testability
- Adds more Typescript strictness by reducing implicit anys
- Misc UI cleanup

## v0.0.21

### Features

- Added a button to explicitly set request param values to `null`
- Added a preview of the request body

### Bugfixes

- Clearing a param value removes it from the request instead of setting the value to `null` ([#26](https://github.com/smartrent/badmagic/issues/26))
- Headers render with a light font color in dark mode

## v0.0.20

### Bugfixes

- Fix clicking on tab such as `Documentation` scrolling to the top of the page

## v0.0.19

### Bugfixes

- If you have a dropdown option with a value of `false` it would revert to the `Select One` option (if that existed). Now `false` is handled appropriately and we just check against `null` or `undefined` for reverting back to `Select One`

### Breaking Change

- `Documentation` tab now requires `html` generated by the webpack `markdown-loader` (usually passed through the `html-loader`) whereas before it would take a JS template string that had markdown inside and parse that string

## v0.0.18

### Features

- Keyword search is workspace specific now
- Better object params support: specifying a key of `properties` will infer that the param is an object (see example below)
- A route can have `sticky: true` added to it so that it cannot be filtered with keyword search
- `Documentation` tab is hidden if there is no documentation specified
- Environment variables previously needed to be saved through click of a button, we've removed the button in favor of using the Enter key

#### New Object Support

```javascript
{
  name: "Create User",
  path: "/v1/users",
  method: Method.POST,
  body: [
    {
      name: "user",
      label: "User",
      properties: [
        { name: "first_name", required: true },
        { name: "last_name", required: true },
        { name: "email", required: true },
        { name: "dob", type: "date" },
      ],
    },
  ]
}
```

### Breaking Changes

- Context no longer has support for `setRouteFilter` and `routeFilter` since it's now namespaced to a workspace. Please use `setWorkspaceSearchKeywords(keywords)` and `getWorkspaceSearchKeywords()` instead

### Notes

- We are going to deprecate `json` as a param option in a future version in favor of a param that has `properties`. We will probably need to do something to have stronger array support so we will leave `json` for now

## v0.0.17

### Features

- Mark URL Params as required (note: it will not enforce this currently)
- If there are no QS params, do not include `?` in the request
- Handle non-json Axios 200 responses and non-json error responses

## v0.0.16

### Features

- Add new `documentation` key to routes to provide Markdown documentation to your end-users

## v0.0.15

### Features

- Style refactor using TailwindCSS

## v0.0.14

### Features

- Dark Mode
- Fixed header for workspaces, search, and env
- Adds ReactJsonView for responses

## v0.0.13

### Features

- Routes collapsed by default
- Inputs have `Set Null` button
- Routes have a reset form button
- Improve Route / Request Spacing

### Bugfixes

- Default values are now applied without requiring a keystroke

import { groupBy, reduce, compact, startCase } from "lodash-es";

import { Route, Workspace, Param, GenericObject, Method } from "../types";

import Helpers from "./helpers";

function getParameterType({ type, options, json, properties }: Param) {
  if (!type || ["date", "text"].includes(type)) {
    return "string";
  } else if (type === "number") {
    return "integer"; // @todo need to differentiate between integer + float
  } else if (json === true && !properties?.length) {
    // @todo explanation for this logic
    // note: `json` is deprecated, however we don't yet have a tool for `array` input
    return "array";
  } else if (json === true || !!properties?.length) {
    // note: `json` is deprecated, just use `properties`
    return "object";
  } else if (options?.length) {
    return "array";
  }

  // We need to add support for these
  console.log(`Unknown type when determining OpenAPI type: ${type}`);

  return "string"; // default
}

function getObjectProperties({ properties }: Param) {
  return reduce(
    properties,
    (memo, property) => {
      const { name } = property;
      memo[name] = {
        description: getLabel(property),
        type: getParameterType(property),
      };

      return memo;
    },
    {}
  );
}

function getPayloadName(name: string) {
  return `${name.replace(" ", "")}Payload`;
}

function getObjectRequiredProperties(params: Param[]): string[] {
  if (!params?.length) {
    return [];
  }
  return compact(
    params.map((param: Param) => {
      if (!param.required) {
        return null;
      }

      return param.name;
    })
  );
}

function generateParameters(
  params: undefined | Param[],
  paramLocation: string
) {
  return (params || []).map((param: Param) => {
    const { name, label, required } = param;

    let schema: GenericObject = {
      type: getParameterType(param),
    };

    if (schema.type === "object") {
      schema.properties = getObjectProperties(param);
    }

    const openApiParams: GenericObject = {
      name,
      description: label,
      required: required || false,
      schema,
    };

    if (paramLocation) {
      openApiParams.in = paramLocation;
    }

    return openApiParams;
  });
}

function getLabel({ label, name }: Param) {
  return label || startCase(name);
}

function generateBody(params: undefined | Param[]) {
  return reduce(
    params,
    (memo, param: Param) => {
      const { name, required } = param;

      memo[name] = {
        description: getLabel(param),
        // format: "date-time",
        // maxLength
        // minLength
        // "pattern": "^\\d+$",
        nullable: required, // @todo, is this a safe assumption?
        type: getParameterType(param),
      };

      return memo;
    },
    {}
  );
}

function methodContainsBody(method: Method) {
  return [Method.POST, Method.PATCH, Method.PUT].includes(method);
}

export default {
  downloadOpenApiJson({ workspace }: { workspace: Workspace }) {
    const { routes } = workspace;

    const groupedRoutes = groupBy(routes, "path");

    const routesWithBodies = routes.filter(({ method }) =>
      methodContainsBody(method)
    );

    const openApiSchemas = reduce(
      routesWithBodies,
      (memo, route: Route) => {
        const { body, name } = route;

        if (!body?.length) {
          return memo;
        }

        const properties = generateBody(body);

        memo[getPayloadName(name)] = {
          description: "",
          example: {}, // @todo
          properties,
          required: getObjectRequiredProperties(body),
          title: "",
          type: "object",
        };

        return memo;
      },
      {}
    );

    const openApiPaths = reduce(
      groupedRoutes,
      (memo, routes: Route[], path: string) => {
        if (!memo[path]) {
          memo[path] = {};
        }
        routes.forEach(
          ({ method, description, name, qsParams, body, tags, responses }) => {
            const urlParams: {
              label: string;
              name: string;
            }[] = Helpers.getUrlParamsFromPath(path);

            const openApiQsParams = generateParameters(qsParams, "query");
            const openApiUrlParams = generateParameters(urlParams, "path");

            let requestBody;
            if (!!body?.length && methodContainsBody(method)) {
              requestBody = {
                content: {
                  "application/json": {
                    schema: {
                      $ref: `#/components/schemas/${getPayloadName(name)}`,
                    },
                  },
                },
                description: `${name} payload`,
                required: true,
              };
            }

            memo[path][(method || Method.GET).toLowerCase()] = {
              callbacks: {},
              deprecated: false,
              description: description || "",
              operationId: name,
              parameters: [...openApiQsParams, ...openApiUrlParams],
              requestBody,
              responses: responses || {},
              summary: name,
              tags: tags?.length ? tags : [],
            };
          }
        );

        return memo;
      },
      {}
    );

    return {
      components: {
        responses: {},
        schemas: openApiSchemas,
      },
      info: {
        title: workspace.name,
        version: workspace.version || "0.0.1", // version isn't required so handling backwards compatibility here
      },
      openapi: "3.0.0",
      paths: openApiPaths,
      security: [],
      servers: [
        {
          url: "",
          variables: {},
        },
      ],
      tags: [],
    };
  },
};

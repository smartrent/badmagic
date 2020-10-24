import { groupBy, reduce, compact, map } from "lodash-es";

import { GenericObject, Route, Workspace, Param, Method } from "../types";

import {
  OpenApiParameterIn,
  OpenApiInfo,
  OpenApiComponents,
  OpenApiPaths,
  OpenApiSchema,
  OpenApiMap,
  OpenApi,
  OpenApiParameter,
} from "openapi-v3";

import Helpers from "./helpers";

function getParameterType({ type, options, json, properties }: Param) {
  if (options?.length) {
    const firstOptionValue = options[0]?.value;

    switch (typeof firstOptionValue) {
      case "string":
        return "string";
      case "number":
        return "number";
      case "boolean":
        return "boolean";
    }
  } else if (!type || ["date", "text"].includes(type)) {
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
  }

  // We need to add support for these
  console.log(`Unknown type when determining OpenAPI type: ${type}`);

  return "string"; // default
}

function getObjectProperties(properties: Param[]): OpenApiSchema["properties"] {
  return reduce(
    properties,
    (memo: OpenApiSchema["properties"], property) => {
      const { name } = property;
      memo[name] = deriveSchemaFromParam(property);

      return memo;
    },
    {}
  );
}

function getPayloadName(name: string) {
  return `${name.replace(/[^A-Za-z0-9]/g, "")}Payload`;
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

// QS or Url Param
function generateParameter(
  param: Param,
  paramLocation?: OpenApiParameterIn
): OpenApiParameter {
  const { name, required } = param;

  const description = param.description ?? param.label; // Try description first then fallback to label

  let schema: OpenApiSchema = deriveSchemaFromParam(param);

  return {
    name,
    description,
    required: required ?? paramLocation === "path", // if it's in URL Params, it's required
    schema,
    in: paramLocation,
  };
}

function generateParameters(
  params: undefined | Param[],
  paramLocation?: OpenApiParameterIn
): OpenApiParameter[] {
  return (params || []).map((param: Param) =>
    generateParameter(param, paramLocation)
  );
}

function methodContainsBody(method: Method) {
  return [Method.POST, Method.PATCH, Method.PUT].includes(method);
}

function deriveSchemaFromRoute(route: Route): OpenApiSchema {
  const { name } = route;

  const title = getPayloadName(name);

  let properties = {};
  if (route.body) {
    properties = reduce(
      route.body,
      (memo: OpenApiSchema["properties"], bodyParam) => {
        memo[bodyParam.name] = deriveSchemaFromParam(bodyParam);
        return memo;
      },
      {}
    );
  }

  return {
    description: route.description || "",
    example: route.example || {},
    properties,
    required: getObjectRequiredProperties(route.body),
    title,
  };
}

function deriveSchemaFromParam(param: Param): OpenApiSchema {
  let schema: OpenApiSchema = {
    type: getParameterType(param),
  };

  if (schema.type === "object" || param.properties?.length) {
    schema.properties = getObjectProperties(param.properties);
    schema.required = getObjectRequiredProperties(param.properties);
  }

  if (param?.options?.length) {
    schema.enum = map(param?.options, "value");
  }

  if (param?.description) {
    schema.description = param.description;
  } else if (param?.label) {
    schema.description = param.label;
  } else if (param?.defaultValue) {
    schema.description = `(e.g. ${param.defaultValue})`;
  }

  if (param?.format) {
    schema.format = param.format;
  }

  if (param?.hasOwnProperty("minLength")) {
    schema.minLength = param.minLength;
  }

  if (param?.maxLength) {
    schema.maxLength = param.maxLength;
  }

  if (param?.pattern) {
    schema.pattern = param.pattern;
  }

  if (param?.hasOwnProperty("nullable")) {
    schema.nullable = param.nullable;
  }

  // Dev note: There is more support we can add here but this is a good starting point.

  return schema;
}

/**
 * If OpenApi Schemas are not explicitly specified,
 * derive from the Workspace -> Routes
 */
function deriveOpenApiSchemas({
  workspace,
}: {
  workspace: Workspace;
}): OpenApiMap<OpenApiSchema> {
  const routesWithBodies = workspace.routes.filter(({ method }) =>
    methodContainsBody(method)
  );
  return reduce(
    routesWithBodies,
    (memo: OpenApiMap<OpenApiSchema>, route: Route) => {
      const title = getPayloadName(route.name);
      memo[title] = deriveSchemaFromRoute(route);
      return memo;
    },
    {}
  );
}

function convertPathToOpenApiFormat(path: string): string {
  return path
    .split("/")
    .map((part) => {
      if (part.indexOf(":") === 0) {
        return `{${part.replace(":", "")}}`;
      }

      return part;
    })
    .join("/");
}

/**
 * If OpenApi Paths are not explicitly specified,
 * derive from the Workspace -> Routes
 */
function deriveOpenApiPaths({
  workspace,
}: {
  workspace: Workspace;
}): OpenApiPaths {
  const groupedRoutes = groupBy(workspace.routes, "path");

  return reduce(
    groupedRoutes,
    (memo: GenericObject, routes: Route[], path: string) => {
      const openApiPath = convertPathToOpenApiFormat(path);

      if (!memo[openApiPath]) {
        memo[openApiPath] = {};
      }
      routes.forEach(
        ({
          method,
          description,
          name,
          qsParams,
          body,
          tags,
          responses,
          deprecated,
        }) => {
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

          const sanitizedMethod = (method || Method.GET).toLowerCase();

          memo[openApiPath][sanitizedMethod] = {
            callbacks: {},
            deprecated: deprecated ?? false,
            description: description || "",
            operationId: name,
            parameters: [...openApiQsParams, ...openApiUrlParams],
            requestBody,
            summary: name,
            tags: tags?.length ? tags : [],
          };

          if (responses) {
            memo[openApiPath][sanitizedMethod].responses = responses;
          }
        }
      );

      return memo;
    },
    {}
  );
}

/**
 * If OpenApi Components are not explicitly specified,
 * derive Components from what was specified in the workspace
 * @param param0
 */
function deriveComponents({
  workspace,
}: {
  workspace: Workspace;
}): OpenApiComponents {
  return {
    schemas:
      workspace.components?.schemas ?? deriveOpenApiSchemas({ workspace }),
  };
}

function deriveOpenApiInfo({
  workspace,
}: {
  workspace: Workspace;
}): OpenApiInfo {
  return {
    title: workspace.name, // overwritten by workspace.info.title if specified
    description: "", // overwritten by workspace.info.description if specified
    version: "0.0.1", // overwritten by workspace.info.version if specified
    ...(workspace.info ?? {}),
  };
}

export default {
  generate({ workspace }: { workspace: Workspace }): OpenApi {
    return {
      components: workspace.components ?? deriveComponents({ workspace }),
      info: deriveOpenApiInfo({ workspace }),
      servers: workspace.servers ?? [],
      openapi: workspace.openapi ?? "3.0.0",
      paths: workspace.paths ?? deriveOpenApiPaths({ workspace }),
      tags: workspace.tags ?? [],
      security: workspace.security ?? [],
      externalDocs: workspace.externalDocs ?? { url: "" },
    };
  },
};

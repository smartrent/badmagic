import {
  OpenApiComponents,
  OpenApiResponses,
  OpenApiTag,
  OpenApiPaths,
  OpenApiInfo,
  OpenApiSecurityRequirement,
  OpenApiExternalDocs,
  OpenApiServer,
  OpenApiSchema,
} from "openapi-v3";

export type Workspace = {
  id: string;
  version?: string; // semver
  routes: Route[];
  name: string;
  plugins: Plugin[];
  config: {
    baseUrl: string;
  };

  // OpenApi
  components?: OpenApiComponents;
  info?: OpenApiInfo;
  servers?: OpenApiServer[];
  openapi?: string;
  paths?: OpenApiPaths;
  tags?: OpenApiTag[];
  security?: OpenApiSecurityRequirement[];
  externalDocs?: OpenApiExternalDocs;
};

export type RouteConfig = {
  [key: string]: {
    urlParams: Param[];
    qsParams: Param[];
    body: Param[];
    headers: GenericObject;
    response: null | GenericObject;
    error: null | any;
    loading: boolean;
  };
};

export interface GenericObject {
  [key: string]: any;
}

export type Option = {
  label?: string;
  value: any;
};

export enum ParamType {
  qsParams = "qsParams",
  body = "body",
  urlParams = "urlParams",
}

export type Param = {
  name: string;
  label?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  options?: Option[];
  defaultValue?: string;
  json?: boolean; // value should be stringified, deprecated -- use `properties`
  properties?: Param[]; // if working with json, pass in array of properties
  description?: string;

  // OpenAPI support
  nullable?: boolean;
  format?: OpenApiSchema["format"]; // OpenAPI format /* https://swagger.io/docs/specification/data-models/data-types/#string */
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

export enum Method {
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  GET = "GET",
  DELETE = "DELETE",
}

export type Route = {
  name: string; // must be unique
  description?: string;
  summary?: string;
  path: string;
  body?: Param[];
  qsParams?: Param[];
  method?: Method;
  plugins?: Plugin[];
  documentation?: string;
  example?: GenericObject; // e.g. {first_name: "John", last_name: "Doe", ...}
  sticky?: boolean; // whether the route should stick to the top of the workspace or not

  responses?: OpenApiResponses; // OpenApi Responses
  tags?: string[];
  deprecated?: boolean;
};

export enum Inject {
  asRequest = "asRequest",
  asResponse = "asResponse",
}

export type Plugin = {
  inject: Inject;
  Component: any;
};

export type PluginProps = {
  route: Route;
  context: any;
  loading: boolean;
  reFetch: () => void;
};

export interface Icon {
  size?: number;
  color: string;
}

export type SetParamFn = (payload: {
  route: Route;
  param: Param;
  value: any;
  paramType: ParamType;
  parent?: string;
}) => void;

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
  AuthForm?: ({ workspaceId }: { workspaceId: string }) => React.ReactElement; // a form you can render to have the user specify their auth credentials

  useAxiosMiddleware?: (requestBag: {
    method: undefined | Method;
    urlParams: Record<string, any>;
    qsParams: Record<string, any>;
    body: Record<string, any>;
    url: string;
    route: Route;
  }) => any; // intercepted callback function before submitting an API request
};

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
  example?: Record<string, any>; // e.g. {first_name: "John", last_name: "Doe", ...}
  sticky?: boolean; // whether the route should stick to the top of the wor or not
  baseUrl?: string; // if not specified on the route but exists on workspace.config.baseUrl, it will default to that

  responses?: OpenApiResponses; // OpenApi Responses
  tags?: string[];
  deprecated?: boolean;
};

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
  defaultValue?: any;
  array?: boolean;
  json?: boolean; // value should be stringified, deprecated -- use `properties` for Objects and `array` for lists
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

// @todo remove
export enum Inject {
  asRequest = "asRequest",
  asResponse = "asResponse",
}

// @todo remove
export type PluginProps = {
  route: Route;
  plugin: Plugin;
  context: Record<string, any>;
  loading: boolean;
  reFetch: OnSubmitFn;
};

// @todo remove
export type Plugin = {
  inject?: Inject;
  Component: React.ComponentType<PluginProps>;
};

export interface Icon {
  size?: number;
  color: string;
}

export interface SetParamPayload {
  param?: Param;
  value: any;
  pathToValue: string;
}
export type SetParamFn = (payload: SetParamPayload) => void;

export type Size = "xs" | "sm" | "lg" | "xl";

export type OnSubmitFn = () => void;
export interface RenderInputsProps {
  pathToValue: string;
  inputs: Param[];
  onSubmit: OnSubmitFn;
  className: string;
  values: Record<string, any>;
  setValues: (values: any) => void;
}

export interface RenderInputByDataTypeProps {
  pathToValue: string;
  onSubmit: OnSubmitFn;
  param: Param;
  onRemoveCell?: () => void;
  values: Record<string, any>;
  setValues: (values: any) => void;
}

export interface RenderObjectProps {
  pathToValue: string;
  param: Param;
  onSubmit: OnSubmitFn;
  label?: string;
  onRemoveCell?: () => void;
  values: Record<string, any>;
  setValues: (values: any) => void;
}

export interface RenderArrayOfInputsProps {
  pathToValue: string;
  param: Param;
  onSubmit: OnSubmitFn;
  label: string;
  values: Record<string, any>;
  setValues: (values: any) => void;
}

export interface ApplyNullValueButtonProps {
  value: any;
  pathToValue: string;
  onRemoveCell?: () => void;
  values: Record<string, any>;
  setValues: (values: any) => void;
}

export interface ClearValueButtonProps {
  pathToValue: string;
  onRemoveCell?: () => void;
  hidden: boolean;
  setValues: (values: any) => void;
  values: Record<string, any>;
}

export interface AddArrayCellProps {
  values: Record<string, any>[];
  pathToValue: string;
  param: Param;
  arrayOfValues: any[];
  setValues: (values: any) => void;
}

export interface RemoveArrayCellButtonProps {
  onRemoveCell?: () => void;
  className?: string;
  label?: string;
}

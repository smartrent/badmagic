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
  sticky?: boolean; // whether the route should stick to the top of the workspace or not

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

export enum Inject {
  asRequest = "asRequest",
  asResponse = "asResponse",
}

export type PluginProps = {
  route: Route;
  plugin: Plugin;
  context: Record<string, any>;
  loading: boolean;
  reFetch: OnSubmitFn;
};

export type Plugin = {
  inject: Inject;
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
}

export interface ClearValueButtonProps {
  pathToValue: string;
  onRemoveCell?: () => void;
  hidden: boolean;
}

export interface AddArrayCellProps {
  values: any[];
  pathToValue: string;
  param: Param;
}

export interface RemoveArrayCellButtonProps {
  onRemoveCell?: () => void;
  className?: string;
  label?: string;
}

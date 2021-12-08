import { AxiosResponse, AxiosError } from "axios";
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

export type WorkspaceConfig = {
  baseUrl: string;
} & Record<string, any>;

export interface ApiResponse {
  config: {
    headers: Record<string, any>;
  };
  status: number;
  data: any;
  headers: Record<string, any>;
}

export interface ApiError {
  code: string | undefined;
  isAxiosError: boolean;
  response: {
    status: number | undefined;
    data: any;
    headers: Record<string, any>;
  };
}

export interface StoreHistoricResponsePayload {
  metadata: Record<string, any>;
  response: null | ApiResponse;
  error: null | ApiError;
  route: Route;
  urlParams: Record<string, any>;
  qsParams: Record<string, any>;
  body: Record<string, any>;
}

export interface HistoricResponse {
  response: null | ApiResponse;
  error: null | ApiError;
  // Engineers can store what they want in the HistoricResponse like who issued the request
  metadata: Record<string, any>;
  route: Route;
  urlParams: Record<string, any>;
  qsParams: Record<string, any>;
  body: Record<string, any>;
}

export type StoreHistoricResponse = (
  payload: StoreHistoricResponsePayload
) => void;

export type Workspace = {
  id: string;
  version?: string; // semver
  routes: Route[];
  name: string;
  config: WorkspaceConfig;

  // OpenApi
  components?: OpenApiComponents;
  info?: OpenApiInfo;
  servers?: OpenApiServer[];
  openapi?: string;
  paths?: OpenApiPaths;
  tags?: OpenApiTag[];
  security?: OpenApiSecurityRequirement[];
  externalDocs?: OpenApiExternalDocs;

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
  documentation?: string;
  example?: Record<string, any>; // e.g. {first_name: "John", last_name: "Doe", ...}
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
export interface Icon {
  size?: number;
  color: string;
}

export type Size = "xs" | "sm" | "lg" | "xl";

export type OnSubmitFn = () => void;
export interface RenderInputsProps {
  pathToValue: null | string;
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
  pathToValue: null | string;
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
  values: Record<string, any>;
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

export type ApplyAxiosInterceptors = ({
  axios,
  storeHistoricResponse,
}: {
  axios: any;
  storeHistoricResponse: StoreHistoricResponse;
}) => any; // @todo type return is AxiosInstance

export type AuthForm = ({
  workspaceConfig,
}: {
  workspaceConfig: WorkspaceConfig;
}) => React.ReactElement;

export type HistoryMetadata = ({
  metadata,
}: {
  metadata: Record<string, any>;
}) => React.ReactElement;

export interface BadMagicProps {
  workspaces: Workspace[];

  applyAxiosInterceptors?: ApplyAxiosInterceptors;

  AuthForm?: AuthForm; // a form you can render to have the user specify their auth credentials
  HistoryMetadata?: HistoryMetadata; // a React component that can be rendered to display additional metadata
}

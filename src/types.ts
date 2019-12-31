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
};

export enum Method {
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  GET = "GET",
  DELETE = "DELETE",
}

export type Route = {
  name: string;
  path: string;
  body?: Param[];
  qsParams?: Param[];
  method?: Method;
  plugins?: Plugin[];
  documentation?: string;
  sticky?: boolean;
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

export type Workspace = {
  id: string;
  routes: Route[];
  name: string;
  plugins: Plugin[];
  config: {
    baseUrl: string;
  };
};

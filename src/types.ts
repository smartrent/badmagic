export type UrlParam = {
  name: string;
  label?: string;
};

export type QSParam = {
  name: string;
  label?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  options?: Option[];
};

export type Option = {
  label?: string;
  value: any;
};

export type BodyParam = {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  options?: Option[];
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
  body?: BodyParam[];
  qsParams?: QSParam[];
  method?: Method;
  plugins?: Plugin[];
};

export type Plugin = {
  injectAfter: string;
  Component: any;
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

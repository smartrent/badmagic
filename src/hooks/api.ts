import {
  Reducer,
  useEffect,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import axios, {
  Method,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { isEqual } from "lodash-es";

const { CancelToken } = axios;

declare global {
  interface Window {
    baseURL: string;
    websocketAccessToken: any;
    csrfToken: string;
    idleSessionTimeout: number | null;
  }
}

export interface Options {
  apiNamespace?: string;
  version?: string;
}

interface UseApiState<TResponse = any> {
  response: AxiosResponse<TResponse> | null;
  error: Error | null;
  loading: boolean;
}

enum ActionType {
  init = "init",
  success = "success",
  fail = "fail",
}

interface InitAction {
  type: ActionType.init;
}

interface SuccessAction<TResponse> {
  type: ActionType.success;
  payload: AxiosResponse<TResponse>;
}

interface FailAction {
  type: ActionType.fail;
  payload: AxiosError<any>;
}

type Action<TResponse> = InitAction | SuccessAction<TResponse> | FailAction;

function reducer<TResponse = any>(
  _state: UseApiState,
  action: Action<TResponse>
): UseApiState<TResponse> {
  switch (action.type) {
    case ActionType.init:
      return { response: null, error: null, loading: true };
    case ActionType.success:
      return { response: action.payload, error: null, loading: false };
    case ActionType.fail:
      return { response: null, error: action.payload, loading: false };
  }
}

interface UseApiParams {
  /** The request URL */
  url: string | false;

  /** The request method */
  method?: Method;

  /** Axios config options */
  options?: AxiosRequestConfig;

  /** The request will be repeated whenever this value changes */
  trigger?: any;

  /** If false, the request will not be made automatically */
  autoFetch?: boolean;
}

export function useApi<TResponse = any>(
  { url, method = "GET", options, trigger, autoFetch = true }: UseApiParams,
  axiosInstance: typeof axios
) {
  const initialState: UseApiState = {
    response: null,
    error: null,
    loading: !!autoFetch,
  };

  const [state, dispatch] = useReducer<
    Reducer<UseApiState<TResponse>, Action<TResponse>>
  >(reducer, initialState);

  useEffect(() => {
    dispatch({ type: ActionType.init });
  }, [url, method, options]);

  // options is an object, and unless callers always wrap it into useMemo, we
  // can't pass it to a dependency list or the value will change every time
  // (which will cause infinite rerender loop), so we store options in state
  // and only update if the options is not deeply equal to stableOptions
  const [stableOptions, setStableOptions] = useState(options);

  useEffect(() => {
    if (!isEqual(stableOptions, options)) {
      setStableOptions(options);
    }
  }, [options, stableOptions]);

  const cancelTokenSourceRef = useRef(CancelToken.source());

  // TODO: trigger shouldn't be necessary
  const stringifiedTrigger = useMemo(() => {
    if (typeof trigger === "undefined") {
      return true;
    }

    try {
      return JSON.stringify(trigger);
    } catch (err) {
      return trigger;
    }
  }, [trigger]);

  const doRequest = useCallback(async () => {
    if (!url) {
      return;
    }

    dispatch({ type: ActionType.init });

    try {
      const response = await axiosInstance({
        url,
        method,
        ...stableOptions,
        cancelToken: cancelTokenSourceRef.current.token,
      });

      dispatch({ type: ActionType.success, payload: response });

      return response;
    } catch (error) {
      // ignore cancellation errors (they're not real errors)
      if (!axios.isCancel(error)) {
        // @ts-ignore
        dispatch({ type: ActionType.fail, payload: error });
      }
    }
  }, [url, axiosInstance, method, stableOptions]);

  useEffect(() => {
    // React will clean up refs when the component unmounts, so we need to
    // keep a reference to the cancelTokenSource in order to use it in our
    // cleanup function
    const cancelTokenSource = cancelTokenSourceRef.current;
    if (autoFetch === false) {
      return;
    }

    // TODO: when removing trigger, ensure all callers that *don't* pass it
    // *do* pass autoFetch: false
    if (stringifiedTrigger === false) {
      return;
    }

    // execute the request
    doRequest();

    return () => {
      // cancel the request when the caller component unmounts or the options changed
      cancelTokenSource.cancel(
        "Operation canceled because the caller component unmounted or passed new options"
      );

      // reset the cancelTokenSourceRef. this is necessary in case the options just
      // changed and we're not unmounting.
      cancelTokenSourceRef.current = CancelToken.source();
    };
  }, [doRequest, autoFetch, stringifiedTrigger]);

  return {
    ...state,
    query: doRequest,
    reFetch: doRequest,
  };
}

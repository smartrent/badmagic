import React from "react";
import { AxiosResponse, AxiosError } from "axios";

import BodyPreview from "./BodyPreview";
import ApiError from "./ApiError";
import Headers from "./Headers";
import ApiResponse from "./ApiResponse";

import {
  ApiError as ApiErrorProp,
  ApiResponse as ApiResponseProp,
} from "../../types";

export function Response({
  response,
  body,
  error,
}: {
  response: null | AxiosResponse;
  error: null | AxiosError;
  body: Record<string, any>;
}) {
  return (
    <div style={{ flex: 3, overflow: "hidden" }}>
      <BodyPreview body={body} />
      <ApiResponse response={response as null | ApiResponseProp} />
      <ApiError error={error as null | ApiErrorProp} />
      <Headers headers={response?.config?.headers} label="Request Headers" />
      <Headers
        label="Response Headers"
        headers={response?.headers || error?.response?.headers}
      />
    </div>
  );
}

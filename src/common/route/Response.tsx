import React from "react";
import { AxiosResponse, AxiosError } from "axios";

import BodyPreview from "./BodyPreview";
import ApiError from "./ApiError";
import Headers from "./Headers";
import ApiResponse from "./ApiResponse";
import { ApiResponseStatus } from "./ApiResponseStatus";

import {
  ApiError as ApiErrorProp,
  ApiResponse as ApiResponseProp,
} from "../../types";

export const isAxiosError = (err: any): err is AxiosError => {
  return err && typeof err === "object" && err.isAxiosError;
};

export function Response({
  response,
  body,
  error,
}: {
  response: undefined | null | ApiResponseProp | AxiosResponse;
  error: undefined | null | ApiErrorProp | Error | AxiosError;
  body: Record<string, any>;
}) {
  return (
    <div style={{ flex: 3, overflow: "hidden" }}>
      <BodyPreview body={body} />
      <div className="mb-1">
        <ApiResponseStatus
          status={response?.status || (error as AxiosError)?.response?.status}
        />
      </div>
      <ApiResponse response={response as null | ApiResponseProp} />
      <ApiError error={error as null | ApiErrorProp} />
      <Headers headers={response?.config?.headers} label="Request Headers" />
      <Headers
        label="Response Headers"
        headers={
          response?.headers ||
          (isAxiosError(error) ? error?.response?.headers : null)
        }
      />
    </div>
  );
}

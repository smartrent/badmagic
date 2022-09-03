import React, { useCallback, useState, useMemo } from "react";

import ApiResponse from "./route/ApiResponse";
import ApiError from "./route/ApiError";
import { ApiResponseStatus } from "./route/ApiResponseStatus";
import BodyPreview from "./route/BodyPreview";
import { TopBar } from "./route/TopBar";

import Headers from "./route/Headers";
import Label from "./Label";

import { useGlobalContext } from "../context/GlobalContext";
import Button from "../common/Button";

import { HistoricResponse, HistoryMetadata } from "../types";

export function HistoricRecord({
  historicResponse,
  HistoryMetadata,
}: {
  historicResponse: HistoricResponse;
  HistoryMetadata?: HistoryMetadata;
}) {
  const {
    route,
    qsParams,
    urlParams,
    body,
    response,
    error,
    metadata,
  } = historicResponse;
  const [bodyExpanded, setBodyExpanded] = useState(false);
  const [responseExpanded, setResponseExpanded] = useState(false);

  const toggleBodyExpanded = useCallback(() => {
    setBodyExpanded(!bodyExpanded);
  }, [bodyExpanded]);
  const toggleResponseExpanded = useCallback(() => {
    setResponseExpanded(!responseExpanded);
  }, [responseExpanded]);

  const {
    darkMode,
    setPartialRequestResponse,
    setActiveRoute,
  } = useGlobalContext();

  const onLoadRequest = useCallback(() => {
    setActiveRoute(historicResponse.route);
    setPartialRequestResponse(historicResponse);
  }, [historicResponse]);

  const styles = useMemo(() => {
    return {
      container: darkMode
        ? "bg-gray-800 border-gray-700"
        : "bg-gray-100 border-gray-200",
      textColor: darkMode ? "text-white" : "",
    };
  }, [darkMode]);

  return (
    <div className={`my-4 border rounded pt-4 px-4 pb-2 ${styles.container}`}>
      <div className="flex justify-start items-center mb-4">
        <TopBar route={route} qsParams={qsParams} urlParams={urlParams} />
        <div className="px-1 self-start">
          <ApiResponseStatus
            status={response?.status || error?.response?.status}
          />
        </div>
      </div>
      {Object.keys(body)?.length ? (
        <>
          <div onClick={toggleBodyExpanded} className="cursor-pointer my-2">
            <Label>Show Request {bodyExpanded ? "-" : "+"}</Label>
          </div>
          {bodyExpanded ? <BodyPreview body={body} /> : null}
        </>
      ) : null}

      {response ? (
        <div onClick={toggleResponseExpanded} className="cursor-pointer my-2">
          <Label>Show Response {responseExpanded ? "-" : "+"}</Label>
        </div>
      ) : null}
      {responseExpanded ? (
        <>
          <ApiResponse response={response} />
          <ApiError error={error} />
        </>
      ) : null}
      <Headers headers={response?.config?.headers} label="Request Headers" />
      <Headers
        label="Response Headers"
        headers={response?.headers || error?.response?.headers}
      />

      {HistoryMetadata ? (
        <div className={`${styles.textColor} text-xs mt-4`}>
          <HistoryMetadata metadata={metadata} />
        </div>
      ) : null}

      <Button className="mt-2" onClick={onLoadRequest}>
        Load Request
      </Button>
    </div>
  );
}

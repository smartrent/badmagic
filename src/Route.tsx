import React from "react";

import { RequestResponse } from "./common/route/RequestResponse";
import { Documentation } from "./common/route/Documentation";

import { History } from "./common/History";

import { AuthFormContainer } from "./common/route/AuthFormContainer";

import {
  Route,
  ApplyAxiosInterceptors,
  AuthForm,
  HistoryMetadata,
} from "./types";

export function Route({
  applyAxiosInterceptors,
  AuthForm,
  HistoryMetadata,
}: {
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
  AuthForm?: AuthForm;
  HistoryMetadata?: HistoryMetadata;
}) {
  return (
    <>
      <AuthFormContainer AuthForm={AuthForm} />
      <RequestResponse applyAxiosInterceptors={applyAxiosInterceptors} />
      <History HistoryMetadata={HistoryMetadata} />
      <Documentation />
    </>
  );
}

import React, { useState, useCallback, useMemo } from "react";
import useAxios from "@smartrent/use-axios";
import axios, { AxiosResponse, AxiosError } from "axios";

import { useGlobalContext } from "./context/GlobalContext";

import { RequestResponse } from "./common/route/RequestResponse";
import { Documentation } from "./common/route/Documentation";

import { History } from "./common/History";

import { Route, ApplyAxiosInterceptors } from "./types";

export default function Route({
  route,
  applyAxiosInterceptors,
}: {
  route: Route;
  applyAxiosInterceptors?: ApplyAxiosInterceptors;
}) {
  return (
    <div>
      <RequestResponse
        route={route}
        applyAxiosInterceptors={applyAxiosInterceptors}
      />
      <History activeRoute={route} />
      <Documentation documentation={route.documentation} />
    </div>
  );
}

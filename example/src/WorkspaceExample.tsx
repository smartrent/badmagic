import React, { StrictMode } from "react";

import { BadMagic } from "badmagic";

import { catWorkspace } from "./cat-workspace";
import { dogWorkspace } from "./dog-workspace";
import { AxiosInstance } from "axios";
import { StoreHistoricResponse } from "../../dist/types";

export default function App() {
  return (
    <StrictMode>
      <BadMagic
        basename="/dev/api"
        workspaces={[catWorkspace, dogWorkspace]}
        applyAxiosInterceptors={(args: any) => {
          const { axios, storeHistoricResponse } = args as {
            axios: AxiosInstance;
            storeHistoricResponse: (
              args: Omit<
                Parameters<StoreHistoricResponse>[0],
                "route" | "qsParams" | "urlParams" | "body"
              >
            ) => void;
          };
          axios.interceptors.response.use((response) => {
            storeHistoricResponse({
              metadata: {},
              response: {
                status: response.status,
                headers: response.headers ?? {},
                config: { headers: response.config.headers ?? {} },
                data: response.data,
              },
              error: null,
            });

            return response;
          });

          return axios;
        }}
      />
    </StrictMode>
  );
}

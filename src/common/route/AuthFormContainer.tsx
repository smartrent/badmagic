import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import { useGlobalContext } from "../../context/GlobalContext";

import { AuthForm } from "../../types";

export function AuthFormContainer({ AuthForm }: { AuthForm?: AuthForm }) {
  const { workspaces } = useGlobalContext();
  const params = useParams<{ workspace: string }>();

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.name === params.workspace),
    [params, workspaces]
  );

  return AuthForm && activeWorkspace?.config ? (
    <AuthForm workspaceConfig={activeWorkspace?.config} />
  ) : null;
}

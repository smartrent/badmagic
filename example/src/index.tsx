import { createRoot } from "react-dom/client";

import WorkspaceExample from "./WorkspaceExample";

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(<WorkspaceExample />);

import OpenApi from "../src/lib/openapi";

import dogWorkspace from "../example/src/lib/dog-workspace";
import expectedOpenApiJson from "./mock/dog-workspace-openapi.json";

describe("OpenAPI", () => {
  it("generate works", () => {
    const json = OpenApi.generate({ workspace: dogWorkspace });

    // Uncomment to get output when updating `expectedOpenApiJson` for the dog-workspace test
    // IMPORTANT: run against https://editor.swagger.io/ to ensure syntax is valid
    // console.log(JSON.stringify(json));

    expect(json).toEqual(expectedOpenApiJson);
  });
});

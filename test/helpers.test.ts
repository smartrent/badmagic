import helpers from "../src/lib/helpers";

describe("helpers", () => {
  it("returns dark mode styles if dark mode is enabled", () => {
    expect(helpers.getStyles(true, "themeContainer")).toEqual({
      backgroundColor: "#1A1F27",
      color: "#fff",
    });

    expect(helpers.getStyles(false, "themeContainer")).toEqual({});
  });
});

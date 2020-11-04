module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
};

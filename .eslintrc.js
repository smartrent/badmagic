module.exports = {
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "shared-node-browser": true,
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: [/dist/],
  rules: {
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-inferrable-types": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        // allow unused args, which is really common in callbacks, and removing
        // them doesn't provide much value
        args: "none",

        // allow this common pattern: `{dropThisKeyFromRest, ...rest} = obj`
        ignoreRestSiblings: true,
      },
    ],
    "react/prop-types": ["off"],
  },
};

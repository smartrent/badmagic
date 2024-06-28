const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules[1].oneOf.unshift({
        test: /\.md$/,
        type: "asset/source",
      });

      console.log(webpackConfig.output);
      const n = Date.now();
      while (Date.now() < n + 1000) {}

      return webpackConfig;
    },
    devServer: (devServerConfig) => {
      console.log(devServerConfig);
      throw new Error("foo");
    },
  },
};

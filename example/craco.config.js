const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules[1].oneOf.unshift({
        test: /\.md$/,
        type: "asset/source",
      });

      return webpackConfig;
    },
    devServer: (devServerConfig) => {
      console.log(devServerConfig);
      throw new Error("foo");
    },
  },
};

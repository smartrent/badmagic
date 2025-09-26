const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules[1].oneOf.unshift({
        test: /\.md$/,
        type: "asset/source",
      });

      // Ensure React resolves to local node_modules to avoid hook conflicts
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, "node_modules"),
        ...webpackConfig.resolve.modules,
      ];

      return webpackConfig;
    },
  },
};

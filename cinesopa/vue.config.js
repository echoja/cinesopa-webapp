const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/'
  //   : '/sopaseom/',
  lintOnSave: true,
  configureWebpack: (config) => {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
      // config.plugins.push(new BundleAnalyzerPlugin());
    } else {
      // mutate config for development or etc...
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
  devServer: {
    port: 29537,
    public: 'localhost:29537',
    // disableHostCheck: true,
    proxy: {
      '^/graphql': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      '^/upload': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      // '^/foo': {
      //   target: '<other_url>'
      // }
    },
  },
};

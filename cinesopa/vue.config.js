const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/'
  //   : '/sopaseom/',
  lintOnSave: true,
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin(), new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
  },
  devServer: {
    proxy: {
      '^/graphql': {
        target: 'http://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      // '^/upload': {
      //   target: 'https://localhost:4000',
      //   ws: true,
      //   changeOrigin: true,
      // },
      // '^/foo': {
      //   target: '<other_url>'
      // }
    },
  },
};

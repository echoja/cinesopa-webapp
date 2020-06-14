module.exports = {
  lintOnSave: true,
  devServer: {
    proxy: {
      '^/graphql': {
        target: 'https://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      '^/upload': {
        target: 'https://localhost:4000',
        ws: true,
        changeOrigin: true,
      },
      // '^/foo': {
      //   target: '<other_url>'
      // }
    },
  },
};

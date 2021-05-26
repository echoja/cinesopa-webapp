module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/'
  //   : '/sopaseom/',
  lintOnSave: true,
  devServer: {
    port: 29538,
    public: 'localhost:29538',
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

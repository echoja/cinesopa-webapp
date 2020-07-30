module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/sopaseom/',
  lintOnSave: true,
  devServer: {
    proxy: {
      '^/graphql': {
        target: 'https://localhost:4040',
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

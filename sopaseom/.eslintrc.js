module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'brace-style': 'off',
    'operator-linebreak': 'off',
    camelcase: 'off',
    'implicit-arrow-linebreak': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
    'function-paren-newline': 'off',
  },
};

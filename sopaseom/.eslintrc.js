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
    camelcase: 'warn',
    'no-restricted-syntax': 'off',
    'object-curly-newline': 'off',
    'brace-style': 'off',
    'operator-linebreak': 'off',
    'camelcase': 'off',
  },
};

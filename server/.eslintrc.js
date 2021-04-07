module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'prettier',
    // 'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:mocha/recommended',
    'plugin:chai-friendly/recommended',
    // 'plugin:import',
    'plugin:import/errors',
    'plugin:import/warnings',
    // 'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'html', 'graphql', 'prettier', 'import'],
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    commonjs: true,
    node: true,
    mocha: true,
    es2021: true,
  },
  rules: {
    'no-await-in-loop': 1,
    'no-underscore-dangle': 0,
    'no-unused-vars': 1,
    'no-plusplus': 0,
    'no-return-await': 1,
    'no-use-before-define': 0,
    'no-shadow': 1,
    'no-console': 0,
    'no-param-reassign': 0,
    'object-curly-newline': 0,
    'func-names': 0, // setTimeout(function () {}, 0);
    'prefer-arrow-callback': 0, // setTimeout(function () {}, 0)
    'class-methods-use-this': 0,
    camelcase: 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'import/no-cycle': 1,
    'mocha/no-setup-in-describe': 1,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', 'js', 'jsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

        // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

        // use <root>/path/to/folder/tsconfig.json
        // "project": "path/to/folder",

        // Multiple tsconfigs (Useful for monorepos)

        // use a glob pattern
        project: 'tsconfig.json',

        // // use an array
        // "project": [
        //   "packages/module-a/tsconfig.json",
        //   "packages/module-b/tsconfig.json"
        // ],

        // // use an array of glob patterns
        // "project": [
        //   "packages/*/tsconfig.json",
        //   "other-packages/*/tsconfig.json"
        // ]
      },
    },
  },
};

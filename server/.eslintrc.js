module.exports = {
  root: true,
  extends: [
    'standard',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:mocha/recommended',
    'plugin:chai-friendly/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'html', 'graphql'],
  parserOptions: {
    ecmaVersion: 12,
  },
  env: {
    browser: true,
    commonjs: true,
    node: true,
    jquery: true,
    mocha: true,
    es2021: true,
  },
  // 'classPrivateMethods', 'babel'
  rules: {
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    // "no-var": 0,
    // 'no-console': 0,
    // 'no-plusplus': 0,
    // 'vars-on-top': 0,
    // 'no-underscore-dangle': 0, // var _foo;
    // 'comma-dangle': 0,
    'object-curly-newline': 0,
    'no-await-in-loop': 1,
    'func-names': 0, // setTimeout(function () {}, 0);
    'prefer-arrow-callback': 0, // setTimeout(function () {}, 0)
    'class-methods-use-this': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 1,
    'no-plusplus': 0,
    'no-return-await': 1,
    camelcase: 0,
    'graphql/template-strings': [
      'error',
      {
        // Import default settings for your GraphQL client. Supported values:
        // 'apollo', 'relay', 'lokka', 'fraql', 'literal'
        env: 'literal',

        // Import your schema JSON here
        // schemaJson: require('./schema.json'),

        // OR provide absolute path to your schema JSON (but not if using `eslint --cache`!)
        // schemaJsonFilepath: path.resolve(__dirname, './schema.json'),

        // OR provide the schema in the Schema Language format
        // schemaString: printSchema(schema),

        // tagName is gql by default
      },
    ],
    // 'prefer-template': 0,
    // 'no-nested-ternary': 0,
    // 'max-classes-per-file': 0,
    // 'arrow-parens': ['error', 'as-needed'], // a => {}
    // 'no-restricted-syntax': [0, 'ForOfStatement'],
    // 'no-param-reassign': ['error', { props: false }],
  },
};

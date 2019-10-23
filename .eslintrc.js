module.exports = {
  'parser': 'babel-eslint',
  'extends': [
      'eslint:all',
  ],
  'parserOptions': {
      'ecmaVersion': 2018,
      'sourceType': 'module',
  },
  'plugins': [
      'babel', // https://github.com/babel/eslint-plugin-babel
  ],
  'env': {
      'browser': true,
      'shared-node-browser': true,
      'es6': true,
      'es2017': true,
      'commonjs': true,
  },
  'rules': {
      'array-bracket-newline': ['error', 'consistent'],
      'array-element-newline': 'off',
      'arrow-body-style': 'off',
      'brace-style': ['error', '1tbs', {'allowSingleLine': true}],
      'camelcase': 'warn',
      'capitalized-comments': ['warn', 'always', {
          'ignoreConsecutiveComments': true,
      }],
      'class-methods-use-this': 'off',
      'comma-dangle': ['error', 'always-multiline'],
      'curly': ["error", "multi-line"],
      'dot-location': ["error", "property"],
      'eqeqeq': ['error', 'smart'],
      'func-names': 'off',
      'func-style': ["error", "declaration", { "allowArrowFunctions": true }],
      'guard-for-in': 'off',
      'id-length': 'off',
      'indent': ['error', 2],
      'init-declarations': 'off',
      'line-comment-position': 'off',
      'linebreak-style': ['error', 'unix'],
      'lines-around-comment': 'off',
      'max-len': ['warn', {'ignoreTrailingComments': true}],
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'max-statements-per-line': 'off',
      'multiline-comment-style': ['error', 'separate-lines'],
      'multiline-ternary': ['error', 'always-multiline'],
      'new-cap': 'off',
      // 'babel/new-cap': 1,
      'newline-per-chained-call': 'off',
      'no-alert': 'warn',
      'no-confusing-arrow': 'off',
      'no-console': 'warn',
      'no-continue': 'off',
      'no-eq-null': 'off',
      'no-extra-semi': 'error',
      'no-inline-comments': 'off',
      'babel/no-invalid-this': 2,
      'no-invalid-this': 'off',
      'no-magic-numbers': 'off',
      'no-mixed-operators': 'off',
      'no-multi-assign': 'off',
      'no-multi-str': 'off',
      'no-new': 'warn',
      'no-plusplus': 'off',
      'no-prototype-builtins': 'off',
      'no-ternary': 'off',
      'no-underscore-dangle': 'off',
      // 'babel/no-unused-expressions': 1,
      'no-unused-expressions': ['error', {
          'allowShortCircuit': true,
          'allowTernary': true,
          'allowTaggedTemplates': true
      }],
      'no-unused-vars': 'warn',
      'no-use-before-define': 'warn',
      'no-warning-comments': 'warn',
      'object-curly-newline': 'off',
      // 'babel/object-curly-spacing': 1,
      'object-property-newline': ['error', {
          'allowAllPropertiesOnSameLine': true,
      }],
      'one-var': ['error', 'never'],
      'padded-blocks': ['error', 'never'],
      'prefer-destructuring': 'warn',
      'quote-props': ['error', 'as-needed'],
      // 'babel/quotes': 1,
      'quotes': ['error', 'single', {'avoidEscape': true}],
      'require-jsdoc': 'off',
      // 'babel/semi': 1,
      'semi': ['error', 'never'],
      'sort-imports': 'off',
      'sort-keys': 'off',
      'space-before-function-paren': ['error', {
          'anonymous': 'always',
          'named': 'never',
          'asyncArrow': 'always',
      }],
      // 'babel/valid-typeof': 1
  },
}

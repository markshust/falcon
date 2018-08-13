module.exports = {
  parser: 'babel-eslint',
  extends: ['eslint-config-airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    node: true,
    jest: true
  },
  rules: {
    'class-methods-use-this': 'off',
    'consistent-return': 0,
    'global-require': 'off',
    'import/default': 0,
    'import/no-duplicates': 0,
    'import/named': 0,
    'import/namespace': 0,
    'import/no-unresolved': 0,
    'import/no-named-as-default': 2,
    'import/extensions': ['off', 'never'],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/__tests__/*', '**/*.test.js', '**/webpack/*.js']
      }
    ],
    'jsx-a11y/anchor-is-valid': [
      'off',
      {
        components: ['Link']
      }
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        components: ['Label'],
        required: {
          every: ['id']
        },
        allowChildren: false
      }
    ],
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx']
      }
    ],
    'react/no-danger': 'off',
    'react/no-multi-comp': 0,
    // problem with redux-connect decorator so we cannot use required on props,
    // therefore everything would need to be defined in default props
    'react/require-default-props': [0],

    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: true
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'no-alert': 0,
    'no-console': 0,
    'no-plusplus': 'off',
    'id-length': [
      1,
      {
        exceptions: ['_', 'e', 't', 'x']
      }
    ],

    'one-var': 0,
    'no-param-reassign': 'off',
    'object-curly-newline': 'off',
    'valid-jsdoc': [
      'error',
      {
        requireReturn: false
      }
    ]
  },
  plugins: ['react', 'import'],
  settings: {
    'import/parser': 'babel-eslint'
  },
  globals: {
    __DEVELOPMENT__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __DEVTOOLS__: true,
    socket: true,
    webpackIsomorphicTools: true
  }
};

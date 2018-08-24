const { BABEL_ENV, NODE_ENV } = process.env;
const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        targets: {
          // > 0.5%, last 2 versions, Firefox ESR, not dead
          browsers: 'defaults'
        }
      }
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
  plugins: [
    // '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    cjs && 'transform-es2015-modules-commonjs'
  ].filter(Boolean)
};

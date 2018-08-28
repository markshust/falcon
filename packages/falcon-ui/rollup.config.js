import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import pkg from './package.json';

const externals = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

const makeExternalPredicate = externalsArr => {
  if (externalsArr.length === 0) {
    return () => false;
  }
  const externalPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`);
  return id => externalPattern.test(id);
};

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

export default {
  input: 'src/index.ts',
  external: makeExternalPredicate(externals),
  plugins: [
    resolve({
      extensions
    }),
    babel({
      extensions
    }),
    sizeSnapshot({ matchSnapshot: false })
  ],
  output: [{ file: pkg.main, format: 'cjs', sourcemap: true }, { file: pkg.module, format: 'esm', sourcemap: true }]
};

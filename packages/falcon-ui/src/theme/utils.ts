import merge from 'deepmerge';
import isPlainObject from 'is-plain-object';

import { mappings } from './propsmapings';
import { Theme, RecursivePartial } from './index';

const themablePropsKeys = [...Object.keys(mappings), 'css'];

export function extractThemableProps(props: any) {
  const themableProps: any = {};
  const rest: any = {};

  // eslint-disable-next-line
  for (let key in props) {
    if (themablePropsKeys.indexOf(key as any) !== -1) {
      themableProps[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  }

  return {
    themableProps,
    rest
  };
}

export function mergeThemes(theme: Theme, themeOverride: RecursivePartial<Theme>): Theme {
  return merge(theme, themeOverride, {
    isMergeableObject: isPlainObject
  });
}

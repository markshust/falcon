import { mappings } from './propsmapings';

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

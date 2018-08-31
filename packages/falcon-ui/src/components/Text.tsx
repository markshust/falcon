import { themed } from '../theme';

export const Text = themed(
  {
    themeKey: 'text',
    tag: 'p',
    ellipsis: false
  },
  {
    display: 'block',
    pb: 'md',
    m: 'none',
    css: props => (props.ellipsis ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {})
  }
);

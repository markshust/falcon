import { themed } from '../theme';

export const Input = themed(
  {
    themeKey: 'input',
    tag: 'input',
    type: 'text'
  },
  {
    p: 'sm',
    border: 'light',
    borderColor: 'primary',
    borderRadius: 'sm',
    css: {
      WebkitAppearance: 'none',
      width: '100%',
      '&[type="number"]': {
        width: '80px'
      },
      '&[type="color"]': {
        width: '80px',
        padding: 0
      }
    }
  }
);

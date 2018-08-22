import { themed } from '../theme';

export const Button = themed({
  themeKey: 'button',
  as: 'button'
})({
  fontFamily: 'inherit',
  WebkitFontSmoothing: 'antialiased',
  display: 'inline-block',
  border: 'none',
  textDecoration: 'none',
  appearance: 'none',
  ':focus': {
    outline: 'none'
  }
});

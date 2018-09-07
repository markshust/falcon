import { themed } from '../theme';
import { Input } from './Input';

export const Textarea = themed({
  themeKey: 'textarea',
  tag: 'textarea',
  extend: Input
});

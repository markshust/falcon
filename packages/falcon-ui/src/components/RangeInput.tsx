import { themed, rangeInputThumb, rangeInputTrack } from '../theme';

export const RangeInput = themed({
  themeKey: 'rangeInput',
  tag: 'input',
  type: 'range'
})({
  width: '100%',
  WebkitAppearance: 'none',
  ':focus': {
    outline: 'none'
  },
  ...rangeInputTrack({
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    border: 'none'
  }),
  ...rangeInputThumb({
    WebkitAppearance: 'none',
    cursor: 'pointer',
    border: 'none'
  })
});

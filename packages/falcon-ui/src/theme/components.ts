import { ThemedComponents, ThemedComponent } from './';

const button: ThemedComponent = {
  color: 'secondaryText',
  bg: 'secondary',
  p: 'sm',
  textAlign: 'center',
  borderRadius: 'sm',
  boxShadow: 'sm',
  fontSize: 'md',
  css: props => ({
    transition: 'transform',
    transitionTimingFunction: props.theme.easingFunctions.easeIn,
    transitionDuration: props.theme.transitionDurations.short,
    ':active': {
      transform: 'scale(0.9)'
    },
    ':hover': {
      backgroundColor: props.theme.colors.secondaryLight
    }
  }),
  variants: {
    primary: {
      borderRadius: 'none'
    }
  }
};

const root: ThemedComponent = {
  fontFamily: 'sans',
  fontSize: 'sm',
  lineHeight: 'default'
};

const gridLayout: ThemedComponent = {
  display: 'grid',
  gridGap: 'sm'
};

const flexLayout: ThemedComponent = {
  display: 'flex'
};

const card: ThemedComponent = {
  display: 'block',
  p: 'md',
  pt: 'lg',
  pb: 'lg',
  boxShadow: 'sm',
  border: 'light'
};

export const components: ThemedComponents = {
  root,
  button,
  gridLayout,
  flexLayout,
  card
};

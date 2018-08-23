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

const table: ThemedComponent = {
  borderRadius: 'xs',
  fontSize: 'sm',
  width: '100%',
  boxShadow: 'sm',
  overflowY: {
    xs: 'hidden',
    md: 'initial'
  },
  display: {
    xs: 'block',
    md: 'table'
  }
};

const thead: ThemedComponent = {
  bg: 'primary'
};

const th: ThemedComponent = {
  p: 'md',
  fontWeight: 'regular',
  fontSize: 'md',
  textAlign: 'left'
};

const td: ThemedComponent = {
  p: 'md',
  fontWeight: 'light',
  textAlign: 'left',
  lineHeight: 'large'
};

const tr: ThemedComponent = {
  display: 'table-row',
  borderTop: 'light',
  borderColor: 'primary'
};
const tbody: ThemedComponent = {};

const h1: ThemedComponent = {
  fontSize: 'xxl',
  fontWeight: 'bold',
  lineHeight: 'small',
  p: 'sm',
  m: 'none'
};

const h2: ThemedComponent = {
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: 'small',
  p: 'sm',
  m: 'none'
};

const h3: ThemedComponent = {
  fontSize: 'lg',
  fontWeight: 'bold',
  lineHeight: 'small',
  p: 'sm',
  m: 'none'
};

const h4: ThemedComponent = {
  fontSize: 'md',
  fontWeight: 'bold',
  lineHeight: 'small',
  p: 'sm',
  m: 'none'
};

export const components: ThemedComponents = {
  root,
  button,
  gridLayout,
  flexLayout,
  card,
  table,
  thead,
  th,
  td,
  tr,
  tbody,
  h1,
  h2,
  h3,
  h4
};

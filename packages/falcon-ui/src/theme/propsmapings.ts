import CSS from 'csstype';
import { Theme } from './';

function propsMapping<T extends PropsMapping>(param: T) {
  return param;
}

export const mappings = propsMapping({
  /**
   * Themed margin
   */
  m: {
    cssProp: 'margin',
    themeProp: 'spacing'
  },
  mt: {
    cssProp: 'marginTop',
    themeProp: 'spacing'
  },
  ml: {
    cssProp: 'marginLeft',
    themeProp: 'spacing'
  },
  mr: {
    cssProp: 'marginRight',
    themeProp: 'spacing'
  },
  mb: {
    cssProp: 'marginBottom',
    themeProp: 'spacing'
  },
  p: {
    cssProp: 'padding',
    themeProp: 'spacing'
  },
  pt: {
    cssProp: 'paddingTop',
    themeProp: 'spacing'
  },
  pl: {
    cssProp: 'paddingLeft',
    themeProp: 'spacing'
  },
  pr: {
    cssProp: 'paddingRight',
    themeProp: 'spacing'
  },
  pb: {
    cssProp: 'paddingBottom',
    themeProp: 'spacing'
  },
  bg: {
    cssProp: 'backgroundColor',
    themeProp: 'colors'
  },
  color: {
    cssProp: 'color',
    themeProp: 'colors'
  },

  width: {},
  fontSize: {
    themeProp: 'fontSizes'
  },
  fontFamily: {
    themeProp: 'fonts'
  },
  textAlign: {},
  lineHeight: {
    themeProp: 'lineHeights'
  },
  fontWeight: {
    themeProp: 'fontWeights'
  },
  letterSpacing: {
    themeProp: 'letterSpacings'
  },
  display: {},

  alignItems: {},
  justifyContent: {},
  flexWrap: {},
  flexDirection: {},
  flex: {},
  alignContent: {},
  justifySelf: {},
  alignSelf: {},
  order: {},
  flexBasis: {},
  gridGap: {
    themeProp: 'spacing'
  },
  gridRowGap: {
    themeProp: 'spacing'
  },
  gridColumnGap: {
    themeProp: 'spacing'
  },
  gridColumn: {},
  gridRow: {},
  gridAutoFlow: {},
  gridAutoRows: {},
  gridAutoColumns: {},
  gridTemplateRows: {},
  gridTemplateColumns: {},
  gridTemplateAreas: {},
  borderRadius: {
    themeProp: 'borderRadius'
  },

  border: {
    themeProp: 'borders'
  },
  borderTop: {
    themeProp: 'borders'
  },
  borderRight: {
    themeProp: 'borders'
  },
  borderBottom: {
    themeProp: 'borders'
  },
  borderLeft: {
    themeProp: 'borders'
  },
  borderColor: {
    themeProp: 'colors'
  },
  boxShadow: {
    themeProp: 'boxShadows'
  },
  opacity: {},
  position: {},
  top: {},
  right: {},
  bottom: {},
  left: {},
  zIndex: {
    themeProp: 'zIndex'
  },
  overflow: {},
  overflowX: {},
  overflowY: {}
});

export type PropsMappings = typeof mappings;

export type ResponsivePropMapping = {
  cssProp?: keyof CSS.Properties;
  themeProp?: keyof Theme;
};

type PropsMapping = {
  [name: string]: ResponsivePropMapping;
};

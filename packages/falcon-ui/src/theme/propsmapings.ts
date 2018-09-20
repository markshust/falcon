import CSS from 'csstype';
import { Theme, CSSObject } from './';

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
  mx: {
    themeProp: 'spacing',
    transformToCss: value => ({
      marginLeft: value,
      marginRight: value
    })
  },
  my: {
    themeProp: 'spacing',
    transformToCss: value => ({
      marginTop: value,
      marginBottom: value
    })
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
  px: {
    themeProp: 'spacing',
    transformToCss: value => ({
      paddingLeft: value,
      paddingRight: value
    })
  },
  py: {
    themeProp: 'spacing',
    transformToCss: value => ({
      paddingTop: value,
      paddingBottom: value
    })
  },
  bg: {
    cssProp: 'backgroundColor',
    themeProp: 'colors'
  },
  fill: {
    themeProp: 'colors'
  },
  stroke: {
    themeProp: 'colors'
  },
  bgFullWidth: {
    themeProp: 'colors',
    transformToCss: value => ({
      position: 'relative',
      zIndex: 1,
      ':before': {
        content: '""',
        width: '200vw',
        height: '100%',
        background: value,
        position: 'absolute',
        left: '-50vw',
        right: '50vw',
        top: 0,
        zIndex: -1
      }
    })
  },
  color: {
    cssProp: 'color',
    themeProp: 'colors'
  },

  width: {},
  height: {},

  size: {
    transformToCss: value => ({
      height: value,
      width: value
    })
  },

  fontSize: {
    themeProp: 'fontSizes'
  },
  fontFamily: {
    themeProp: 'fonts'
  },

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
  gridArea: {},

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
  left: {}
});

export type PropsMappings = typeof mappings;

export type ResponsivePropMapping = {
  cssProp?: keyof CSS.Properties;
  themeProp?: keyof Theme;
  transformToCss?: (value: number | string) => CSSObject;
};

type PropsMapping = {
  [name: string]: ResponsivePropMapping;
};

import React from 'react';
import styled from '@emotion/styled-base';
import isPropValid from '@emotion/is-prop-valid';

import {
  Theme,
  CSSObject,
  PropsWithTheme,
  ThemedComponentProps,
  ThemedComponentPropsWithVariants,
  InlineCss,
  extractThemableProps
} from './';

import { mappings, PropsMappings, ResponsivePropMapping } from './propsmapings';

const propsMappingKeys = Object.keys(mappings) as (keyof PropsMappings)[];

const convertPropToCss = (
  mappingKey: string,
  propMapping: ResponsivePropMapping,
  matchingProp: string | number,
  theme: Theme
) => {
  // if mapping does not have cssProp specified fallback to it's key as css property name
  const cssPropName = propMapping.cssProp || mappingKey;
  // if matching props is themable prop then get it's actual value from theme props otherwise
  // then just pass it as css prop value
  // TODO: typescript: is there a way to improve those typings?
  const cssPropValue = !propMapping.themeProp ? matchingProp : (theme[propMapping.themeProp] as any)[matchingProp];

  return {
    cssPropName,
    cssPropValue
  };
};

type PropsWithThemeKey = {
  themeKey?: string;
  variant?: string;
};

type PropsWithDefaultTheme = {
  defaultTheme?: ThemedComponentPropsWithVariants;
};

type ThemedProps = ThemedComponentProps & PropsWithTheme & PropsWithThemeKey & PropsWithDefaultTheme;

const convertThemedPropsToCss = (props: ThemedComponentProps, theme: Theme): CSSObject => {
  //  if theme is not provided via theme provider do not map anything
  if (!theme) {
    return {};
  }
  // TODO: typescript: can typings be improved for that object?
  const cssObject = {} as any;

  // eslint-disable-next-line
  for (let mappingKey in props) {
    const propMapping = mappings[mappingKey as keyof PropsMappings];
    const matchingProp = (props as any)[mappingKey];

    // move along if there is no matching prop in mappings for given key found
    if (!propMapping) {
      continue;
    }
    // if matching prop is typeof string it means it's not responsive
    if (typeof matchingProp === 'string' || typeof matchingProp === 'number') {
      const cssPair = convertPropToCss(mappingKey, propMapping, matchingProp, theme);
      cssObject[cssPair.cssPropName] = cssPair.cssPropValue;
    } else {
      // if it's not string it needs to be object that has responsive breakpoints keys
      // here we only translate all themed values to css values, we don't create media queries
      // eslint-disable-next-line
      for (let breakpointKey in matchingProp) {
        const breakpointValue = (theme.breakpoints as any)[breakpointKey];
        const matchingResponsiveProp = matchingProp[breakpointKey];
        if (breakpointValue === undefined) {
          continue;
        }

        const cssPair = convertPropToCss(mappingKey, propMapping, matchingResponsiveProp, theme);

        if (!cssObject[cssPair.cssPropName]) {
          cssObject[cssPair.cssPropName] = {};
        }

        cssObject[cssPair.cssPropName][breakpointKey] = cssPair.cssPropValue;
      }
    }
  }

  return cssObject;
};

const nestedCssObjectSelectors = [':', '&', '*', '>', '@'];

function convertResponsivePropsToMediaQueries(css: CSSObject, theme: Theme) {
  const target: any = {};
  const mediaQueries: any = {};

  // eslint-disable-next-line
  for (let cssProp in css) {
    const cssValue = css[cssProp];
    if (!cssValue || typeof cssValue !== 'object' || Array.isArray(cssValue)) {
      target[cssProp] = cssValue;
    }
    // we need to look for responsive props in nested css as well
    // for example in :hover object
    else if (nestedCssObjectSelectors.indexOf(cssProp[0]) !== -1) {
      target[cssProp] = convertResponsivePropsToMediaQueries(cssValue as CSSObject, theme);
    } else {
      // eslint-disable-next-line
      for (let potentialBreakpointKey in cssValue) {
        const breakpointValue = (theme.breakpoints as any)[potentialBreakpointKey];
        const valueForBreakpoint = (cssValue as any)[potentialBreakpointKey];
        if (breakpointValue) {
          // add media query key to mediaQueries object if it hasn't already got one
          if (!mediaQueries[potentialBreakpointKey]) {
            mediaQueries[potentialBreakpointKey] = {};
          }
          mediaQueries[potentialBreakpointKey][cssProp] = valueForBreakpoint;
        } else if (breakpointValue === 0) {
          target[cssProp] = valueForBreakpoint;
        } else {
          if (!target[cssProp]) {
            target[cssProp] = {};
          }

          target[cssProp][potentialBreakpointKey] = valueForBreakpoint;
        }
      }
    }
  }

  // media queries need to be handled in very careful way as order matters
  // so media min-width with smaller px value always apper before media min-width with larger px value
  // in resulting style
  Object.keys(mediaQueries)
    .sort((first, second) => ((theme.breakpoints as any)[first] > (theme.breakpoints as any)[second] ? 1 : -1))
    .forEach(sortedMediaQueryKey => {
      const mediaQueryPxValue = (theme.breakpoints as any)[sortedMediaQueryKey];
      target[`@media screen and (min-width: ${mediaQueryPxValue}px)`] = mediaQueries[sortedMediaQueryKey];
    });

  return target;
}

function getCss(css: InlineCss, props: ThemedProps) {
  return typeof css === 'function' ? css(props) : css;
}

// this function responsibility is to extract css object from
// both themed props (that use props values from theme) and css object/function props

// TODO: perhaps this function could be written in prettier way?
function getThemedCss(props: ThemedProps) {
  //  if theme is not provided via theme provider or inline theme prop do return any css
  if (!props.theme || !props.theme.components) {
    return;
  }

  const { defaultTheme, themeKey, theme, variant, ...remainingProps } = props;
  // first we need to check where themed props and css props are defined and merge them
  // // css props need to merged separately as those do not need to be processed to extract css
  // Merging order
  // 1 -  props defined in defaultTheme props  as those are defaults
  // 2 -  props defined in theme.components for given themeKey  as those are defaults
  // 3 -  props defined in defaultTheme variant prop if props.variant is defined
  // 4 -  props defined in theme.components[]variants if props.variant is defined
  // 5 -  props defined directly on component
  const themedPropsToMerge: any[] = [];
  const cssPropsToMerge: any[] = [];

  const addPropsToMerge = (propsToMerge: ThemedComponentProps) => {
    const { css, ...rest } = propsToMerge;
    if (css) {
      cssPropsToMerge.push(getCss(css, props));
    }
    themedPropsToMerge.push(rest);
  };

  //  start with props defined in defaultTheme prop as base
  if (defaultTheme !== undefined) {
    addPropsToMerge(defaultTheme);
  }

  // if props are defined in theme object for themeKey merge them with default ones
  if (themeKey) {
    const areComponentPropsDefinedInTheme = themeKey && theme.components[themeKey] !== undefined;
    if (areComponentPropsDefinedInTheme) {
      addPropsToMerge(theme.components[themeKey]);
    }

    // themed props can also be defined for component variant
    if (variant) {
      // check for variant props defined in defaultTheme
      const defaultThemeVariants = defaultTheme && defaultTheme.variants;

      if (defaultThemeVariants && defaultThemeVariants[variant]) {
        addPropsToMerge(defaultThemeVariants[variant]);
      }
      // check for variant props defined in theme object
      const themeVariants = areComponentPropsDefinedInTheme && theme.components[themeKey].variants;
      if (themeVariants && themeVariants[variant]) {
        addPropsToMerge(themeVariants[variant]);
      }
    }
  }

  // as last step add for merging those props which defined directly on component
  const { css: inlineCss, ...remainingThemedProps } = remainingProps;
  if (inlineCss) {
    cssPropsToMerge.push(getCss(inlineCss, props));
  }

  // out of all component props extract themable ones and add them to merge
  const { themableProps } = extractThemableProps(remainingThemedProps);
  themedPropsToMerge.push(themableProps);

  const cssFromInlineCssProps = Object.assign({}, ...cssPropsToMerge);
  const mergedThemableProps = Object.assign({}, ...themedPropsToMerge);
  // merged themable props need to be converted to css before returning
  const cssFromThemedProps = convertThemedPropsToCss(mergedThemableProps, theme);

  // finally merge css from themed props with css from css props
  const mergedCss = { ...cssFromThemedProps, ...cssFromInlineCssProps };
  // as a last step we need to check each css prop if it's value is responsive
  return convertResponsivePropsToMediaQueries(mergedCss, theme);
}

// filtering which props to forward to next component is tricky
// and behaves differently if next component is html element, custom component
// or custom component whihch is themed component
const customPropsBlacklist = ['extend', 'themeKey', 'variant', 'defaultTheme'];

const filterPropsToForward = (baseComponent: any, props: any, ref: any) => {
  const filteredProps = {} as any;
  const isThemedComponent = baseComponent.themedComponent;
  const isHtmlTag = typeof baseComponent === 'string';
  // eslint-disable-next-line
  for (let key in props) {
    // when html tag is provided forward only valid html props to it
    if (isHtmlTag && !isPropValid(key)) continue;

    // if custom component is provided via `extend` prop do not forward themable props to it (bg, color, m, p etc)
    // neighter forward any of the blacklisted props
    const themableProp = propsMappingKeys.indexOf(key as any) !== -1 || customPropsBlacklist.indexOf(key) !== -1;
    if (themableProp) continue;

    // if custom component is not a themed component do not forward tag prop to it
    if (!isThemedComponent && key === 'tag') {
      continue;
    }

    filteredProps[key] = props[key];
  }

  filteredProps.ref = ref;

  return filteredProps;
};

// this component handles dynamic html tag rendering via 'extend' and 'tag' props as well as forwards ref to DOM element
// and forwards only allowed html tags
const Tag = React.forwardRef<{}, { extend: any; tag: any }>((props, ref) => {
  const Base = props.extend || props.tag || 'div';
  const nextProps = filterPropsToForward(Base, props as any, ref);

  return React.createElement(Base, nextProps);
});

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type BaseProps<TTag extends string | {}> = {
  tag?: TTag;
} & PropsWithThemeKey &
  (TTag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[TTag] : {}) &
  (TTag extends React.ComponentType<infer TExtendProps> ? Partial<TExtendProps> : {});

export function themed<TProps extends BaseProps<TTag>, TTag extends string | {}>(
  defaultProps: BaseProps<TTag> & TProps,
  themedProps?: ThemedComponentPropsWithVariants<Omit<TProps, 'tag'>>
) {
  const styledComponentWithThemeProps = styled(Tag, {
    label: `${defaultProps.themeKey}${defaultProps.variant ? `-${defaultProps.variant}` : ''}`
  })(getThemedCss);

  styledComponentWithThemeProps.defaultProps = { ...(defaultProps as any), defaultTheme: themedProps };

  styledComponentWithThemeProps.themedComponent = true;

  return styledComponentWithThemeProps as <TTagOverride extends string | {} = TTag>(
    props: BaseProps<TTagOverride> & Partial<Omit<TProps, 'tag'>> & Partial<ThemedProps> & { [x: string]: any }
  ) => JSX.Element;
}

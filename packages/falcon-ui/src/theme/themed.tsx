import React from 'react';
import styled from '@emotion/styled-base';
import isPropValid from '@emotion/is-prop-valid';
import { Theme, CSSObject, PropsWithTheme, ThemedComponentProps } from './';
import { mappings, PropsMappings, ResponsivePropMapping } from './propsmapings';

const propsMappingKeys = Object.keys(mappings) as (keyof PropsMappings)[];

const convertPropToCss = (
  mappingKey: keyof PropsMappings,
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

type ThemedBreakpointsKeysType = keyof Theme['breakpoints'];
type ThemedProps = ThemedComponentProps & PropsWithTheme;

const convertThemedPropsToCss = (props: ThemedProps): CSSObject => {
  //  if theme is not provided via theme provider do not map anything
  if (!props.theme) {
    return {};
  }
  const responsiveBreakpoints = Object.keys(props.theme.breakpoints) as (ThemedBreakpointsKeysType)[];
  // TODO: typescript: can typings be improved for that object?
  const cssObject = {} as any;
  // iterate over all possible responsive props keys and check if passed props have matching prop
  // this is hot path function called potentially many times
  for (let i = 0; i < propsMappingKeys.length; i++) {
    const mappingKey = propsMappingKeys[i];
    const matchingProp = props[mappingKey];
    const propMapping: ResponsivePropMapping = mappings[mappingKey];

    // move along if there is no matching prop for given key found
    if (!matchingProp) {
      continue;
    }

    // if matching prop is typeof string it means it's not responsive
    if (typeof matchingProp === 'string' || typeof matchingProp === 'number') {
      const cssPair = convertPropToCss(mappingKey, propMapping, matchingProp, props.theme);
      cssObject[cssPair.cssPropName] = cssPair.cssPropValue;
    } else {
      // if it's not string it needs to be object that has responsive breakpoints keys
      for (let j = 0; j < responsiveBreakpoints.length; j++) {
        const breakpointKey = responsiveBreakpoints[j];
        // if matching prop has no matching breakpoint key move along
        const matchingResponsiveProp = matchingProp[breakpointKey];
        if (!matchingResponsiveProp) {
          continue;
        }

        const breakpointValue = props.theme.breakpoints[breakpointKey];
        // if specified breakpoint has value 0 (usually default breakpoint)
        // then do not create media query for it, just pass the props straight to the object
        if (breakpointValue === 0) {
          const cssPair = convertPropToCss(mappingKey, propMapping, matchingResponsiveProp, props.theme);
          cssObject[cssPair.cssPropName] = cssPair.cssPropValue;
        } else {
          // if breakpoint value is different than 0 all css props needs to be inside '@media' object

          const mediaQueryMinWidth = typeof breakpointValue === 'number' ? `${breakpointValue}px` : breakpointValue;
          const mediaQueryKey = `@media screen and (min-width: ${mediaQueryMinWidth})`;
          // add media query key to css object if it hasn't already got one
          if (!cssObject[mediaQueryKey]) {
            cssObject[mediaQueryKey] = {};
          }
          const cssPair = convertPropToCss(mappingKey, propMapping, matchingResponsiveProp, props.theme);

          cssObject[mediaQueryKey][cssPair.cssPropName] = cssPair.cssPropValue;
        }
      }
    }
  }

  return cssObject;
};

function getThemedCss(props: ThemedProps & BaseProps) {
  //  if theme is not provided via theme provider or inline theme prop do return any css
  if (!props.theme) {
    return;
  }

  const componentPropsDefinedInTheme = (props.themeKey && props.theme.components[props.themeKey]) || {};
  const componentVariantPropsDefinedInTheme =
    (props.themeKey &&
      props.variant &&
      props.theme.components[props.themeKey] &&
      props.theme.components[props.themeKey]['variants'] &&
      (props.theme.components[props.themeKey]['variants'] as any)[props.variant]) ||
    {};
  // responsive props  get merged together and then converted to Css object here
  // order or merging is important
  const cssFromThemeAndProps = convertThemedPropsToCss({
    ...componentPropsDefinedInTheme, // we start with component props defined with theme
    ...componentVariantPropsDefinedInTheme, // then merge those with props defined in variant if variant is specified
    ...props // finally merge any defined props directly on component
  } as ThemedProps);

  // css props defined via css prop are merged as well
  // each of css props no matter if defined as prop on component or in theme or in theme variant
  // can be a function so we need to execute it using props we have here
  const cssPropDefinedInTheme =
    typeof componentPropsDefinedInTheme.css === 'function'
      ? componentPropsDefinedInTheme.css(props)
      : componentPropsDefinedInTheme.css || {};

  const cssPropDefinedInThemeVariant =
    typeof componentVariantPropsDefinedInTheme.css === 'function'
      ? componentVariantPropsDefinedInTheme.css(props)
      : componentVariantPropsDefinedInTheme.css || {};

  const cssPropDefinedInlineOnComponent = typeof props.css === 'function' ? props.css(props) : props.css || {};

  const cssFromInlineCssProps = {
    ...cssPropDefinedInTheme, // start with css prop defined in theme
    ...cssPropDefinedInThemeVariant, // then merge it with css prop defined in theme variant
    ...cssPropDefinedInlineOnComponent // and finally merge it with css prop defined directly on component
  };

  return { ...cssFromThemeAndProps, ...cssFromInlineCssProps };
}

type BaseProps = {
  as: React.ReactType;
  themeKey?: string;
  variant?: string;
};

// this component handles dynamic html tag rendering via as prop as well as forwards ref to DOM element
const Tag = React.forwardRef<{}, { color: any; as: any }>(({ as: Component, color, ...props }, ref) => (
  <Component {...props} ref={ref} />
));

export function themed<T = {}>(defaultProps: Exclude<T, BaseProps> & BaseProps) {
  type ComponentProps = Partial<typeof defaultProps> & Partial<ThemedProps> & { [x: string]: any };
  type DefaultInlineCss = ((props: ComponentProps) => CSSObject) | CSSObject;

  // themed returns function that accepts default css to be provided by the component
  // it accepts any number or DefaultInlineCss args
  return (...css: DefaultInlineCss[]) => {
    // when custom component is provided via 'as' prop then use it for rendering
    // otherwise render using our generic 'Tag' component
    const shouldRenderCustomComponent = typeof defaultProps.as === 'function';
    const tagToRender = shouldRenderCustomComponent ? defaultProps.as : Tag;

    const ThemedComponent: React.SFC<ComponentProps> = styled(tagToRender, {
      // that method ensures that no custom props are rendered in output html
      // 1 forward props that aren't in our responsive props mapping
      // 2 forward only valid html props or prop 'as' when there is no custom compoent provided
      // as we need 'as' prop in our Tag component
      shouldForwardProp: (name: string) =>
        propsMappingKeys.indexOf(name as any) === -1 &&
        (isPropValid(name) || (!shouldRenderCustomComponent && name === 'as')),

      label: `${defaultProps.themeKey}${defaultProps.variant ? `-${defaultProps.variant}` : ''}`
    })(...css, getThemedCss);

    ThemedComponent.defaultProps = defaultProps;

    return ThemedComponent;
  };
}

// IMPORTANT TODO: typescript:
// Themed factory could be smarter
// when it comes to providing property types based on provided 'as' tag or Component, unfortunatelly it's currently
// blocked by typescript issue: https://github.com/Microsoft/TypeScript/issues/26004
// similar issue: https://github.com/mui-org/material-ui/pull/11731
// partial hack that does not work for our use case
// https://stackoverflow.com/questions/51183228/typescript-parameter-type-inference-failure

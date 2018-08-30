import CSS from 'csstype';
import merge from 'deepmerge';

import { theme } from './theme';

import { PropsMappings } from './propsmapings';

const defaultTheme: Theme = {
  ...theme,
  components: {}
};

export function addToDefaultThemeComponents(componentKey: string, defaults: ThemedComponentPropsWithVariants) {
  defaultTheme.components[componentKey] = defaults;
}

export function createTheme(themeOverride: RecursivePartial<Theme> = {}): Theme {
  return merge<Theme, RecursivePartial<Theme>>(defaultTheme, themeOverride);
}

// export themed component factory
export * from './themed';

// --- exported type definitions for theme  ----
export interface Theme {
  colors: ThemeColors;
  breakpoints: ThemeBreakpoints;
  spacing: ThemeSpacing;
  fonts: ThemeFonts;
  fontSizes: ThemeFontSizes;
  fontWeights: ThemeFontWeights;
  lineHeights: ThemeLineHeights;
  letterSpacings: ThemeLetterSpacings;
  borders: ThemeBorders;
  borderRadius: ThemeBorderRadius;
  boxShadows: ThemeBoxShadows;
  easingFunctions: ThemeEasingFunctions;
  transitionDurations: ThemeTransitionDurations;
  zIndex: ThemeZIndex;
  components: ThemedComponents;
}

type ThemedPropMapping = {
  themeProp: keyof Theme;
};

type CssPropsKeys = keyof CSS.PropertiesFallback<number | string>;
type CssProps = CSS.PropertiesFallback<number | string>;

type ResponsivePropMapping = {
  cssProp: CssPropsKeys;
};

type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]> };

type CSSPseudoObject = { [K in CSS.SimplePseudos]?: CSSObject };

type CssOtherProps = undefined | string | number | CSSObject;

type CSSOthersObject = {
  [propertiesName: string]: CssOtherProps | CssOtherProps[];
};

export interface CSSObject extends CssProps, CSSPseudoObject, CSSOthersObject {}

export interface PropsWithTheme {
  theme: Theme;
}

export type InlineCss<T = {}> = ((props: PropsWithTheme & T) => CSSObject) | CSSObject;

export type ThemedComponentPropsWithCss<T = {}> = {
  [ComponentProp in keyof PropsMappings]?:
    | (PropsMappings[ComponentProp] extends ThemedPropMapping
        ? Extract<keyof Theme[PropsMappings[ComponentProp]['themeProp']], string>
        : PropsMappings[ComponentProp] extends ResponsivePropMapping
          ? CssProps[PropsMappings[ComponentProp]['cssProp']]
          : (string | number))
    | {
        [Breakpoint in keyof Theme['breakpoints']]?: PropsMappings[ComponentProp] extends ThemedPropMapping
          ? Extract<keyof Theme[PropsMappings[ComponentProp]['themeProp']], string>
          : PropsMappings[ComponentProp] extends ResponsivePropMapping
            ? CssProps[PropsMappings[ComponentProp]['cssProp']]
            : (string | number)
      }
} & { css?: InlineCss<T>; animations?: any };

export interface ThemedComponentProps<T = {}> extends ThemedComponentPropsWithCss<T> {}

export type ThemedComponentPropsWithVariants<T = {}> = ThemedComponentProps<T> & {
  variants?: {
    [variantKey: string]: ThemedComponentProps<T>;
  };
};

export interface ThemedComponents {
  [themeKey: string]: ThemedComponentPropsWithVariants;
}

type Colors = typeof theme.colors;
export interface ThemeColors extends Colors {}

type Breakpoints = typeof theme.breakpoints;
export interface ThemeBreakpoints extends Breakpoints {}

type Spacing = typeof theme.spacing;
export interface ThemeSpacing extends Spacing {}

type Fonts = typeof theme.fonts;
export interface ThemeFonts extends Fonts {}

type FontSizes = typeof theme.fontSizes;
export interface ThemeFontSizes extends FontSizes {}

type FontWeights = typeof theme.fontWeights;
export interface ThemeFontWeights extends FontWeights {}

type LineHeights = typeof theme.lineHeights;
export interface ThemeLineHeights extends LineHeights {}

type LetterSpacings = typeof theme.letterSpacings;
export interface ThemeLetterSpacings extends LetterSpacings {}

type Borders = typeof theme.borders;
export interface ThemeBorders extends Borders {}

type BorderRadius = typeof theme.borderRadius;
export interface ThemeBorderRadius extends BorderRadius {}

type BoxShadows = typeof theme.boxShadows;
export interface ThemeBoxShadows extends BoxShadows {}

type EasingFunctions = typeof theme.easingFunctions;
export interface ThemeEasingFunctions extends EasingFunctions {}

type TransitionDurations = typeof theme.transitionDurations;
export interface ThemeTransitionDurations extends TransitionDurations {}

type ZIndex = typeof theme.zIndex;
export interface ThemeZIndex extends ZIndex {}

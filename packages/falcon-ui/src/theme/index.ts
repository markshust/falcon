import CSS from 'csstype';
import merge from 'deepmerge';

import { theme } from './theme';

import { PropsMappings } from './propsmapings';

const defaultTheme: Theme = {
  ...theme,
  components: {}
};

export function createTheme(themeOverride: RecursivePartial<Theme> = {}): Theme {
  return merge<Theme, RecursivePartial<Theme>>(defaultTheme, themeOverride);
}

// export themed component factory
export * from './themed';

export * from './utils';

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

type CssResponsiveProps = {
  [key in CssPropsKeys]?: { [Breakpoint in keyof Theme['breakpoints']]?: CssProps[key] } | CssProps[key]
};

export interface CSSObject extends CssResponsiveProps, CSSPseudoObject, CSSOthersObject {}

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
} & { css?: InlineCss<T> };

export interface ThemedComponentProps<T = {}> extends ThemedComponentPropsWithCss<T> {}

export type ThemedComponentPropsWithVariants<T = {}> = ThemedComponentProps<T> & {
  variants?: {
    [variantKey: string]: ThemedComponentProps<T>;
  };
};

export interface ThemedComponents {
  [themeKey: string]: ThemedComponentPropsWithVariants;
}
type NumberOrStringValues<T> = { readonly [P in keyof T]: number | string };

type Colors = typeof theme.colors;

export interface ThemeColors extends Colors {}

type Breakpoints = NumberOrStringValues<typeof theme.breakpoints>;
export interface ThemeBreakpoints extends Breakpoints {}

type Spacing = NumberOrStringValues<typeof theme.spacing>;
export interface ThemeSpacing extends Spacing {}

type Fonts = typeof theme.fonts;
export interface ThemeFonts extends Fonts {}

type FontSizes = NumberOrStringValues<typeof theme.fontSizes>;
export interface ThemeFontSizes extends FontSizes {}

type FontWeights = typeof theme.fontWeights;
export interface ThemeFontWeights extends FontWeights {}

type LineHeights = NumberOrStringValues<typeof theme.lineHeights>;
export interface ThemeLineHeights extends LineHeights {}

type LetterSpacings = NumberOrStringValues<typeof theme.letterSpacings>;
export interface ThemeLetterSpacings extends LetterSpacings {}

type Borders = typeof theme.borders;
export interface ThemeBorders extends Borders {}

type BorderRadius = NumberOrStringValues<typeof theme.borderRadius>;
export interface ThemeBorderRadius extends BorderRadius {}

type BoxShadows = typeof theme.boxShadows;
export interface ThemeBoxShadows extends BoxShadows {}

type EasingFunctions = typeof theme.easingFunctions;
export interface ThemeEasingFunctions extends EasingFunctions {}

type TransitionDurations = typeof theme.transitionDurations;
export interface ThemeTransitionDurations extends TransitionDurations {}

type ZIndex = typeof theme.zIndex;
export interface ThemeZIndex extends ZIndex {}

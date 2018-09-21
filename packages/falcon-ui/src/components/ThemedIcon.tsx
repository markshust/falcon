import React from 'react';
import { withCSSContext } from '@emotion/core';
import { themed, PropsWithTheme, BaseProps, ThemedComponentProps } from '../theme';

const SVGIcon = themed({
  tag: 'svg',

  defaultTheme: {
    svgIcon: {
      size: 24,
      stroke: 'secondary'
    }
  }
});

type ThemedIconProps = { src: string } & ThemedComponentProps & BaseProps<'svg'>;

export const ThemedIcon = withCSSContext((props: ThemedIconProps, context: PropsWithTheme) => {
  if (!context.theme || !context.theme.icons) return null;
  const { icons } = context.theme;
  const { src, ...rest } = props;

  if (!props.src || !icons[src]) return null;

  const { icon, ...otherProps } = icons[src];

  return <SVGIcon as={icon} {...otherProps as any} {...rest} />;
}) as (props: ThemedIconProps) => JSX.Element;

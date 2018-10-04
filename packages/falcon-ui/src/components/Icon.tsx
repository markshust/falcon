import React from 'react';
import { withCSSContext } from '@emotion/core';
import { themed, PropsWithTheme, BaseProps, ThemedComponentProps } from '../theme';

const IconRenderer = themed({
  tag: 'svg',

  defaultProps: {
    // https://stackoverflow.com/questions/18646111/disable-onfocus-event-for-svg-element
    focusable: 'false'
  },

  defaultTheme: {
    icon: {
      size: 32,
      stroke: 'secondary'
    }
  }
});

type IconProps = { src: string; fallback?: React.ReactNode } & ThemedComponentProps & BaseProps<'svg'>;

export const Icon = withCSSContext((props: IconProps, context: PropsWithTheme) => {
  if (!context.theme || !context.theme.icons) return null;

  const { icons } = context.theme;
  const { src, fallback, ...rest } = props;

  if (!props.src || !icons[src]) {
    return fallback || null;
  }

  const { icon, ...otherProps } = icons[src];

  return <IconRenderer as={icon} {...otherProps as any} {...rest} />;
}) as (props: IconProps) => JSX.Element;

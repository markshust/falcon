import React from 'react';
import { Toggle } from 'react-powerplug';

import { themed } from '../theme';
import { Box } from './Box';
import { Icon } from './Icon';

type DropDownPropsType = {
  onChange?: (selectedItem: any) => void;
};

type DropdownContextType = {
  open?: boolean;
} & DropDownPropsType;

const DropdownContext = React.createContext<DropdownContextType>({});

const DropdownInnerDOM: React.SFC<DropDownPropsType> = ({ onChange, ...rest }) => (
  <Toggle initial={false}>
    {({ on, toggle }) => {
      const onChangeAndClose = (value: any) => () => {
        if (onChange) {
          onChange(value);
        }
      };

      return (
        <DropdownContext.Provider value={{ open: on, onChange: onChangeAndClose }}>
          <Box {...rest} onClick={toggle} onBlur={toggle} tabIndex={-1} />
        </DropdownContext.Provider>
      );
    }}
  </Toggle>
);

export const Dropdown = themed({
  tag: DropdownInnerDOM,

  defaultTheme: {
    dropdown: {
      display: 'flex',
      borderRadius: 'lg',
      border: 'light',
      borderColor: 'primaryDark',
      css: ({ theme }) => ({
        userSelect: 'none',
        position: 'relative',
        ':hover': {
          borderColor: theme.colors.primary
        },
        ':focus': {
          outline: 'none'
        }
      })
    }
  }
});

const DropdownLabelInnerDOM = ({ children, ...rest }: any) => (
  <DropdownContext.Consumer>
    {({ open }) => (
      <Box {...rest} active={open}>
        <span>{children}</span>
        <Icon src={open ? 'dropdownArrowUp' : 'dropdownArrowDown'} fallback={open ? '▴' : '▾'} />
      </Box>
    )}
  </DropdownContext.Consumer>
);

export const DropdownLabel = themed({
  tag: DropdownLabelInnerDOM,

  defaultTheme: {
    dropdownLabel: {
      display: 'flex',
      py: 'sm',
      px: 'md',
      fontSize: 'md',
      justifyContent: 'space-between',
      css: ({ theme }) => ({
        width: '100%',
        cursor: 'pointer',
        '&[data-active]': {
          backgroundColor: theme.colors.primaryDark,
          color: theme.colors.primaryText
        }
      })
    }
  }
});

const DropdownMenuInnerDOM = (props: any) => (
  <DropdownContext.Consumer>
    {({ open }) => <Box as="ul" {...props} display={open ? 'block' : 'none'} />}
  </DropdownContext.Consumer>
);

export const DropdownMenu = themed({
  tag: DropdownMenuInnerDOM,

  defaultTheme: {
    dropdownMenu: {
      m: 'none',
      p: 'none',
      borderRadius: 'sm',
      boxShadow: 'xs',
      bg: 'white',
      css: {
        position: 'absolute',
        listStyle: 'none',
        top: 'calc(100% + 1px)',
        left: 0,
        right: 0
      }
    }
  }
});

const DropdownMenuItemInnerDOM = (props: any) => (
  <DropdownContext.Consumer>
    {({ onChange }) => <Box as="li" {...props} onClick={onChange && onChange(props.value)} />}
  </DropdownContext.Consumer>
);

export const DropdownMenuItem = themed({
  tag: DropdownMenuItemInnerDOM,

  defaultProps: {
    value: undefined as any
  },

  defaultTheme: {
    dropdownMenuItem: {
      p: 'sm',
      css: ({ theme }) => ({
        cursor: 'pointer',
        ':hover': {
          background: theme.colors.primaryLight
        }
      })
    }
  }
});

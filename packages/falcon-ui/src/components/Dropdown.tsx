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
  <Toggle>
    {({ on, toggle, set }) => {
      const onChangeAndClose = (value: any) => () => {
        if (onChange) {
          onChange(value);
        }
      };

      return (
        <DropdownContext.Provider value={{ open: on, onChange: onChangeAndClose }}>
          <Box {...rest} onClick={toggle} onBlur={() => set(false)} tabIndex={-1} />
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

const DropdownLabelInnerDOM: React.SFC<any> = ({ children, ...rest }) => (
  <DropdownContext.Consumer>
    {({ open }) => (
      <Box {...rest}>
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
      css: {
        width: '100%',
        cursor: 'pointer'
      }
    }
  }
});

const DropdownMenuInnerDOM: React.SFC<any> = props => (
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
      css: ({ theme }) => ({
        position: 'absolute',
        listStyle: 'none',
        top: 'calc(100% + 1px)',
        left: 0,
        right: 0,
        zIndex: theme.zIndex.dropDownMenu
      })
    }
  }
});

const DropdownMenuItemInnerDOM: React.SFC<any> = props => (
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

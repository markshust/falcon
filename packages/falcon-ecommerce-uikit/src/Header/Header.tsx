import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Navbar,
  NavbarItem,
  NavbarItemMenu,
  Link,
  List,
  ListItem,
  Icon,
  DefaultThemeProps,
  Box
} from '@deity/falcon-ui';

import { toGridTemplate } from '../helpers';
import { ToggleMiniCartMutation } from '../MiniCart';
import { HeaderData } from './HeaderQuery';

const bannerLayoutTheme: DefaultThemeProps = {
  bannerLayout: {
    display: 'flex',
    justifyContent: 'flex-end',
    bgFullWidth: 'primaryLight',
    m: 'none',
    p: 'none',
    css: {
      listStyle: 'none'
    }
  }
};

export const Banner: React.SFC<{ items: any[] }> = ({ items }) => (
  <List defaultTheme={bannerLayoutTheme}>
    {items.map(item => (
      <ListItem p="md" key={item.name}>
        <Link as={RouterLink} to={item.url}>
          {item.name}
        </Link>
      </ListItem>
    ))}
  </List>
);

export const Nav: React.SFC<{ items: any[] }> = ({ items }) => (
  <Navbar>
    {items.map(item => (
      <NavbarItem key={item.name}>
        <Link as={RouterLink} to="/products">
          {item.name}
        </Link>
        {item.subMenu && (
          <NavbarItemMenu>
            <List>
              {item.subMenu.map((subItem: any) => (
                <ListItem key={subItem.name}>
                  <Link as={RouterLink} to="/products">
                    {subItem.name}
                  </Link>
                </ListItem>
              ))}
            </List>
          </NavbarItemMenu>
        )}
      </NavbarItem>
    ))}
  </Navbar>
);

export enum SearchBarArea {
  logo = 'logo',
  login = 'login',
  cart = 'cart',
  search = 'search'
}

const searchBarLayoutTheme: DefaultThemeProps = {
  searchbarLayout: {
    display: 'grid',
    py: 'md',
    gridGap: 'md',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      [ '200px',             '1fr',                'auto',               'auto'             ],
      [ SearchBarArea.logo,  SearchBarArea.search,  SearchBarArea.login,  SearchBarArea.cart],
    ]),
    css: {
      alignItems: 'center'
    }
  }
};

export const Searchbar = () => (
  <Box defaultTheme={searchBarLayoutTheme}>
    <Link as={RouterLink} gridArea={SearchBarArea.logo} to="/">
      <Icon src="logo" />
    </Link>
    <Icon gridArea={SearchBarArea.login} src="user" />
    <ToggleMiniCartMutation>
      {toggle => <Icon gridArea={SearchBarArea.cart} src="cart" onClick={toggle as any} css={{ cursor: 'pointer' }} />}
    </ToggleMiniCartMutation>
  </Box>
);

export const Header: React.SFC<HeaderData> = ({ bannerLinks, menuItems }) => (
  <header>
    <Banner items={bannerLinks} />
    <Searchbar />
    <nav>
      <Nav items={menuItems} />
    </nav>
  </header>
);

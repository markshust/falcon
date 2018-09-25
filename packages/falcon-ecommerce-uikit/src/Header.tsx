import React from 'react';
import gql from 'graphql-tag';
import { Link as RouterLink } from 'react-router-dom';
import { themed, Navbar, NavbarItem, NavbarItemMenu, Link, List, ListItem, Icon } from '@deity/falcon-ui';
import { Query } from './Query';

export const HeaderLayout = themed({
  tag: 'header',
  defaultTheme: {
    header: {}
  }
});

export const Banner: React.SFC<{ items: any }> = ({ items }) => (
  <List display="flex" bgFullWidth="primaryLight" justifyContent="flex-end">
    {items.map((item: any) => (
      <ListItem p="md" key={item.name}>
        <Link as={RouterLink} to={item.url}>
          {item.name}
        </Link>
      </ListItem>
    ))}
  </List>
);

export const Nav: React.SFC<{ items: any }> = ({ items }) => (
  <Navbar>
    {items.map((item: any) => (
      <NavbarItem key={item.name}>
        <Link>{item.name}</Link>
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

export const SearchbarLayout = themed({
  tag: 'div',
  defaultTheme: {
    searchbarLayout: {
      display: 'grid',
      py: 'md',
      gridTemplateColumns: '1fr 50px 50px',
      css: {
        justifyItems: 'center',
        alignItems: 'center'
      }
    }
  }
});

export const Logo = () => (
  <Link as={RouterLink} to="/" justifySelf="start" css={{ cursor: 'pointer' }}>
    <Icon src="logo" />
  </Link>
);

export const Searchbar = () => (
  <SearchbarLayout>
    <Logo />
    <Icon src="user" />
    <Icon src="cart" />
  </SearchbarLayout>
);

const GET_HEADER_DATA = gql`
  query {
    menuItems @client
    bannerLinks @client
  }
`;

export const Header = () => (
  <Query query={GET_HEADER_DATA}>
    {data => (
      <HeaderLayout>
        <Banner items={data.bannerLinks} />
        <Searchbar />
        <nav>
          <Nav items={data.menuItems} />
        </nav>
      </HeaderLayout>
    )}
  </Query>
);

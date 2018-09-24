import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link as RouterLink } from 'react-router-dom';
import { themed, Navbar, NavbarItem, NavbarItemMenu, Link, List, ListItem, Icon } from '@deity/falcon-ui';

export const HeaderQuery = ({ children, variables }) => (
  <Query
    query={gql`
      query menuItems {
        menuItems @client
        bannerLinks @client
      }
    `}
    variables={variables}
  >
    {children}
  </Query>
);

export const HeaderLayout = themed({
  tag: 'header',
  defaultTheme: {
    header: {
      px: 'md',
      css: {
        margin: '0 auto',
        maxWidth: 1480
      }
    }
  }
});

export const Banner = ({ items }) => (
  <List display="flex" bgFullWidth="primary" justifyContent="flex-end">
    {items.map(item => (
      <ListItem p="md" key={item.name}>
        <Link as={RouterLink} to={item.url}>
          {item.name}
        </Link>
      </ListItem>
    ))}
  </List>
);

export const Nav = ({ items }) => (
  <Navbar>
    {items.map(item => (
      <NavbarItem key={item.name}>
        <Link>{item.name}</Link>
        {item.subMenu && (
          <NavbarItemMenu>
            <List>
              {item.subMenu.map(subItem => (
                <ListItem key={subItem.name}>{subItem.name}</ListItem>
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

export const Searchbar = () => (
  <SearchbarLayout>
    <Icon justifySelf="start" src="logo" />
    <Icon src="user" />
    <Icon src="cart" />
  </SearchbarLayout>
);

export const Header = () => (
  <HeaderQuery>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return (
        <HeaderLayout>
          <Banner items={data.bannerLinks} />
          <Searchbar />
          <Nav items={data.menuItems} />
        </HeaderLayout>
      );
    }}
  </HeaderQuery>
);

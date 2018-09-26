import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import gql from 'graphql-tag';
import {
  themed,
  H1,
  Text,
  Breadcrumbs,
  Breadcrumb,
  Link,
  Divider,
  Button,
  Box,
  FlexLayout,
  Dropdown,
  DropdownLabel,
  DropdownMenu,
  DropdownMenuItem
} from '@deity/falcon-ui';

import { Query } from './Query';
import { ProductsList } from './Products';

const CategoryLayout = themed({
  tag: 'div',

  defaultTheme: {
    productsCategory: {
      display: 'grid',
      gridGap: 'md',
      my: 'lg',
      css: {
        textAlign: 'center'
      }
    }
  }
});

export const BreadcrumbsSection: React.SFC<{ breadcrumbs: any }> = ({ breadcrumbs }) => (
  <Breadcrumbs>
    {breadcrumbs.map((breadcrumb: any, index: number) => (
      <Breadcrumb key={breadcrumb.name} current={breadcrumbs.length - 1 === index}>
        <Link as={RouterLink} to={breadcrumb.url}>
          {breadcrumb.name}
        </Link>
      </Breadcrumb>
    ))}
  </Breadcrumbs>
);

export const SortOrderDropdown: React.SFC<any> = ({ sortOrders, onChange }) => {
  const activeSortOrder = sortOrders.filter((sortOrder: any) => sortOrder.active)[0];

  return (
    <Box display="flex">
      <Dropdown width="100%" onChange={onChange}>
        <DropdownLabel>{activeSortOrder.name}</DropdownLabel>

        <DropdownMenu>
          {sortOrders.map((sortOrder: any) => (
            <DropdownMenuItem key={sortOrder.name} value={sortOrder}>
              {sortOrder.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Box>
  );
};
export const CategoryToolbar: React.SFC<{ sortOrders: any }> = ({ sortOrders }) => (
  <FlexLayout justifyContent="space-between" alignItems="center">
    <Text>Showing x producs out of y</Text>
    <FlexLayout alignItems="center">
      <Text mr="md">Sort by</Text>
      <SortOrderDropdown sortOrders={sortOrders} />
    </FlexLayout>
  </FlexLayout>
);

export const ShowMore = () => (
  <Box my="lg">
    <Button variant="secondary">Show more products</Button>
  </Box>
);

const GET_PRODUCTS = gql`
  query {
    products @client
    breadcrumbs @client
    sortOrders @client
  }
`;

export const Category = () => (
  <Query query={GET_PRODUCTS}>
    {data => (
      <CategoryLayout>
        <BreadcrumbsSection breadcrumbs={data.breadcrumbs} />
        <H1>Pots & Pans</H1>
        <CategoryToolbar sortOrders={data.sortOrders} />
        <Divider />
        <ProductsList products={data.products} />
        <Divider />
        <ShowMore />
      </CategoryLayout>
    )}
  </Query>
);

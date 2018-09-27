import React from 'react';
import gql from 'graphql-tag';
import { themed, Box, Image, Text, H1, NumberInput, Button, Icon, FlexLayout } from '@deity/falcon-ui';
import { Query } from './Query';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductMeta } from './ProductMeta';

export const ProductLayout = themed({
  tag: 'div',
  defaultTheme: {
    productLayout: {
      display: 'grid',
      gridGap: 'md',
      my: 'lg'
    }
  }
});

const asGridAreas = (items: Area[][]) => items.map(item => `"${item.join(' ')}"`).join(' ');

enum Area {
  gallery = 'gallery',
  sku = 'sku',
  title = 'title',
  description = 'description',
  cta = 'cta',
  price = 'price',
  meta = 'meta',
  empty = 'empty'
}

export const ProductDetailsLayout = themed({
  tag: 'article',
  defaultTheme: {
    productLayout: {
      display: 'grid',
      gridGap: 'md',
      gridTemplateColumns: {
        xs: '1fr',
        sm: '1fr 1fr'
      },
      gridTemplateAreas: {
        xs: asGridAreas([
          [Area.title],
          [Area.sku],
          [Area.gallery],
          [Area.price],
          [Area.cta],
          [Area.description],
          [Area.meta]
        ]),
        sm: asGridAreas([
          [Area.gallery, Area.sku],
          [Area.gallery, Area.title],
          [Area.gallery, Area.price],
          [Area.gallery, Area.cta],
          [Area.gallery, Area.description],
          [Area.gallery, Area.meta]
        ])
      },
      gridTemplateRows: {
        sm: 'auto auto auto auto 1fr auto'
      }
    }
  }
});

const GET_PRODUCT = gql`
  query GET_PRODUCT($id: Int!) {
    product(id: $id) {
      id
      sku
      name
      description
      price
      gallery {
        type
        full
        thumbnail
        embedUrl
      }
      seo {
        title
        description
        keywords
      }
      breadcrumbs {
        id
        name
        urlPath
        urlKey
        urlQuery
      }
    }
  }
`;

export const Product = (props: { id: number }) => (
  <Query query={GET_PRODUCT} variables={{ id: props.id }}>
    {({ product }) => (
      <ProductLayout>
        {/* <Breadcrumbs breadcrumbs={breadcrumbs} /> */}
        <ProductDetailsLayout>
          <Box gridArea={Area.gallery}>
            <Image src={product.gallery[0].full} />
          </Box>
          <Text fontSize="sm" gridArea={Area.sku}>
            {`SKU: ${product.sku}`}
          </Text>
          <H1 gridArea={Area.title}>{product.name}</H1>
          <Text fontSize="xxl" gridArea={Area.price}>
            {product.price}
          </Text>
          <Box gridArea={Area.description}>{product.description}</Box>

          <FlexLayout alignItems="center" gridArea={Area.cta}>
            <NumberInput defaultValue="1" mr="md" />
            <Button>
              <Icon src="cart" stroke="white" size={20} mr="sm" />
              Add to basket
            </Button>
          </FlexLayout>
          <Box gridArea={Area.meta} my="lg">
            meta
            {/* <ProductMeta meta={product.meta} /> */}
          </Box>
        </ProductDetailsLayout>
      </ProductLayout>
    )}
  </Query>
);

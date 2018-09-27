import React from 'react';
import gql from 'graphql-tag';
import { themed, Box, Radio, Text, H3, H1, NumberInput, Button, Icon, FlexLayout } from '@deity/falcon-ui';
import { Query } from './Query';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductMeta } from './ProductMeta';
import { ProductGallery } from './ProductGallery';

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
  empty = 'empty',
  options = 'options'
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
          [Area.options],
          [Area.cta],
          [Area.description],
          [Area.meta]
        ]),
        sm: asGridAreas([
          [Area.gallery, Area.sku],
          [Area.gallery, Area.title],
          [Area.gallery, Area.price],
          [Area.gallery, Area.options],
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

const Option: React.SFC<{ option: any }> = ({ option }) => (
  <Box mb="md">
    <H3 mb="md">{option.label}</H3>
    {option.values.map((value: any) => (
      <Radio
        key={value.valueIndex}
        mr="sm"
        icon={<div>{value.label}</div>}
        size={55}
        name={option.attributeId}
        value={value.valueIndex}
      />
    ))}
  </Box>
);

const ProductOptions: React.SFC<{ options: any }> = ({ options }) => (
  <Box>
    {options.map((option: any) => (
      <Option key={option.id} option={option} />
    ))}
  </Box>
);

const GET_PRODUCT = gql`
  query {
    product @client
    breadcrumbs @client
  }
`;

export const Product = () => (
  <Query query={GET_PRODUCT}>
    {({ product, breadcrumbs }) => (
      <ProductLayout>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <ProductDetailsLayout>
          <Box gridArea={Area.gallery} css={{ maxHeight: '100%' }}>
            <ProductGallery items={product.images} />
          </Box>
          <Text fontSize="sm" gridArea={Area.sku}>
            {`SKU: ${product.sku}`}
          </Text>
          <H1 gridArea={Area.title}>{product.title}</H1>

          <Text fontSize="xxl" gridArea={Area.price}>
            {product.price}
          </Text>
          <ProductOptions options={product.configurableOptions} />
          <Box gridArea={Area.description}>{product.description}</Box>

          <FlexLayout alignItems="center" gridArea={Area.cta}>
            <NumberInput defaultValue="1" mr="md" />
            <Button>
              <Icon src="cart" stroke="white" size={20} mr="sm" />
              Add to basket
            </Button>
          </FlexLayout>
          <Box gridArea={Area.meta} my="lg">
            <ProductMeta meta={product.meta} />
          </Box>
        </ProductDetailsLayout>
      </ProductLayout>
    )}
  </Query>
);

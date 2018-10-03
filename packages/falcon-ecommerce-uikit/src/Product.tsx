import React from 'react';
import { themed, Box, Radio, Text, H3, H1, NumberInput, Button, Icon, FlexLayout } from '@deity/falcon-ui';
import { Breadcrumbs } from './Breadcrumbs';
// import { ProductMeta } from './ProductMeta';
import { ProductGallery } from './ProductGallery';
import { ProductTranslations } from './ProductQuery';

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
    productDetailsLayout: {
      display: 'grid',
      gridGap: 'md',
      gridTemplateColumns: {
        xs: '1fr',
        md: '1.5fr 1fr'
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
        md: asGridAreas([
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
        md: 'auto auto auto auto auto 1fr'
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

const ProductOptions: React.SFC<{ options: any[] }> = ({ options }) => (
  <Box>
    {options.map(option => (
      <Option key={option.id} option={option} />
    ))}
  </Box>
);
ProductOptions.defaultProps = {
  options: []
};

const ProductDescriptionLayout = themed({
  tag: 'div',

  defaultTheme: {
    productDescriptionLayout: {
      css: {
        p: {
          margin: 0
        }
      }
    }
  }
});

export class Product extends React.PureComponent<{ product: any; translations: ProductTranslations }> {
  render() {
    const { product, translations } = this.props;

    return (
      <ProductLayout>
        <Breadcrumbs breadcrumbs={product.breadcrumbs} />
        <ProductDetailsLayout>
          <Box gridArea={Area.gallery} css={{ maxHeight: '100%' }}>
            <ProductGallery items={product.gallery} />
          </Box>
          <Text fontSize="sm" gridArea={Area.sku}>
            {`${translations.sku}: ${product.sku}`}
          </Text>
          <H1 gridArea={Area.title}>{product.name}</H1>
          <Text fontSize="xxl" gridArea={Area.price}>
            {product.currency} {product.price}
          </Text>
          <ProductOptions options={product.configurableOptions} />
          <ProductDescriptionLayout
            dangerouslySetInnerHTML={{ __html: product.description }}
            gridArea={Area.description}
          />

          <FlexLayout alignItems="center" gridArea={Area.cta}>
            <NumberInput defaultValue="1" mr="md" />
            <Button>
              <Icon src="cart" stroke="white" size={20} mr="sm" />
              {translations.addToCart}
            </Button>
          </FlexLayout>
          <Box gridArea={Area.meta} my="lg">
            {/* <ProductMeta meta={data.seo} /> */}
          </Box>
        </ProductDetailsLayout>
      </ProductLayout>
    );
  }
}

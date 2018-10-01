import React from 'react';
import {
  Sidebar,
  H2,
  Backdrop,
  Portal,
  Icon,
  List,
  ListItem,
  Box,
  H3,
  DefaultThemeProps,
  Image,
  Link,
  Divider,
  Button
} from '@deity/falcon-ui';
import { MiniCartData } from './MiniCartQuery';
import { ToggleMiniCartMutation } from './MiniCartMutations';
import { SidebarLayout } from '../SidebarLayout';
import { toGridTemplate } from '../helpers';

export enum MiniCartProductArea {
  empty = '.',
  thumb = 'thumb',
  price = 'price',
  productName = 'productName',
  remove = 'remove'
}

const miniCartProductTheme: DefaultThemeProps = {
  miniCartProduct: {
    display: 'grid',
    gridGap: 'sm',
    // prettier-ignore
    gridTemplate: toGridTemplate([
      ['1fr',                     '2fr'                                     ],
      [MiniCartProductArea.thumb, MiniCartProductArea.productName           ],
      [MiniCartProductArea.thumb, MiniCartProductArea.price,          '1fr' ],
      [MiniCartProductArea.thumb, MiniCartProductArea.remove,               ]
    ])
  }
};

const MiniCartProduct: React.SFC<any> = ({ product }) => (
  <Box defaultTheme={miniCartProductTheme}>
    <Image gridArea={MiniCartProductArea.thumb} src={product.src} />
    <H3 gridArea={MiniCartProductArea.productName}>{product.name}</H3>
    <H3 fontWeight="bold" gridArea={MiniCartProductArea.price}>
      {product.currency} {product.price}
    </H3>
    <Link display="flex" alignItems="center">
      <Icon size={24} stroke="primaryDark" src="remove" gridArea={MiniCartProductArea.remove} mr="sm" />
      <span>Remove</span>
    </Link>
  </Box>
);

const MiniCartProducts: React.SFC<any> = ({ products }) => (
  <List>
    {products.map((product: any, index: number) => (
      <ListItem pb="none" key={product.name}>
        <MiniCartProduct product={product} />
        {index < products.length - 1 && <Divider my="lg" />}
      </ListItem>
    ))}
  </List>
);

export const MiniCart: React.SFC<MiniCartData> = ({ miniCart: { open }, basketItems }) => {
  return (
    <ToggleMiniCartMutation>
      {toggle => (
        <React.Fragment>
          <Sidebar as={Portal} visible={open} side="right">
            <SidebarLayout>
              <Icon src="close" onClick={toggle as any} position="absolute" top={15} right={30} />
              <H2 mb="lg">Shopping cart</H2>
              <MiniCartProducts products={basketItems} />
              <Box position="absolute" bottom={0} right={0} left={0} bg="primaryLight" p="md">
                <Button width="100%">Checkout</Button>
              </Box>
            </SidebarLayout>
          </Sidebar>
          <Backdrop as={Portal} visible={open} onClick={toggle as any} />
        </React.Fragment>
      )}
    </ToggleMiniCartMutation>
  );
};

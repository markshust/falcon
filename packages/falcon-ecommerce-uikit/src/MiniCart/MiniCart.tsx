// wyswietlam listę produktów
// przycisk X z zamknięciem
// przyjmuje propsa is open
// robi query

import React from 'react';
import { Sidebar, H1, Backdrop, Portal, Box, Icon } from '@deity/falcon-ui';
import { MiniCartData } from './MiniCartQuery';
import { ToggleMiniCartMutation } from './MiniCartMutations';

export const MiniCart: React.SFC<MiniCartData> = ({ miniCart: { open } }) => {
  return (
    <ToggleMiniCartMutation>
      {toggle => (
        <React.Fragment>
          <Sidebar as={Portal} visible={open} side="right" css={{ position: 'fixed' }}>
            <Box>
              <Icon src="close" onClick={toggle as any} position="absolute" top={10} right={10} />
              <H1 p="lg">Shopping cart</H1>
            </Box>
          </Sidebar>
          <Backdrop as={Portal} visible={open} onClick={toggle as any} />
        </React.Fragment>
      )}
    </ToggleMiniCartMutation>
  );
};

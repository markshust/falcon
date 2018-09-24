import Logo from 'react-feather/dist/icons/octagon';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import User from 'react-feather/dist/icons/user';
import { createTheme } from '@deity/falcon-ui';

export const theme = createTheme({
  icons: {
    logo: {
      icon: Logo,
      size: 50,
      stroke: 'secondaryDark'
    },
    cart: {
      icon: ShoppingCart
    },
    user: {
      icon: User
    }
  }
});

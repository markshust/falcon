import React from 'react';

import { ThemeProvider, Button, Image, Swipeable, SwipeableItem, Box, H2, H3, Text, NumberInput } from '../';
import { themed, createTheme, Theme } from '../theme';

const HomeLayout = themed({
  tag: 'article',
  defaultTheme: {
    homelayout: {}
  }
});

const Card = themed({
  tag: 'div',
  defaultTheme: {
    card: {
      boxShadow: 'xs',
      p: 'md'
    }
  }
});
const ProductLayout = themed({
  tag: 'article',
  defaultTheme: {
    productLayout: {}
  }
});

const defaultThemeWithNewHomeLayoutComponent = createTheme({
  components: {
    homelayout: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
      gridAutoRows: '30vh',
      gridGap: 'md'
    },
    productLayout: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr' },
      gridTemplateRows: '20px 50px 50px 50px 1fr',
      gridGap: 'md',
      bg: 'white',
      boxShadow: 'xs',
      p: 'md',
      alignItems: 'start',
      gridTemplateAreas: {
        xs: '"sku sku" "title title" "price price" "stepper cta" "description description" "carousel carousel"',
        md:
          '"carousel sku sku" "carousel title title" "carousel price price" "carousel stepper cta" "carousel description description"'
      }
    },
    card: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
      variants: {
        hero1: {
          gridColumn: 'span 2'
        },
        hero2: {
          gridRow: 'span 2'
        }
      }
    },
    image: {
      flex: '1 1 0%',
      css: {
        minHeight: '0%',
        objectFit: 'cover'
      }
    }
  }
});

const customizedTheme = createTheme({
  colors: {
    secondary: '#A9CF38'
  },
  components: {
    homelayout: {
      display: 'grid',
      gridGap: 'lg',
      gridTemplateColumns: { xs: '1fr 2fr', md: '1fr 1fr 1fr' }
    },
    productLayout: {
      display: 'grid',
      gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 3fr' },
      gridTemplateRows: '20px 50px 50px 50px 1fr',
      gridGap: 'md',
      bg: 'white',
      boxShadow: 'xs',
      p: 'md',
      alignItems: 'start',
      gridTemplateAreas: {
        xs: '"sku sku" "title title" "price price" "stepper cta" "description description" "carousel carousel"',
        md:
          '"sku sku carousel" "title title carousel" "price price carousel" "cta stepper carousel" "description description carousel"'
      }
    },

    card: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column'
    }
  }
});

const images = [
  {
    src:
      'https://images.unsplash.com/photo-1509729653832-59d8dfee1547?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9afafe7d2dcd746f3a87c452d93d3e1a&auto=format&fit=crop&w=500&q=60',
    featured: true
  },
  {
    src:
      'https://images.unsplash.com/photo-1512100430645-4b5a7ebac43e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=845aa85b9b7220c4357585bb51557ff1&auto=format&fit=crop&w=668&q=80',
    campaign: true
  },
  {
    src:
      'https://images.unsplash.com/photo-1515949893587-40b6dbcb4350?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9d388cc85bfcd8c0a4125acfacb914e5&auto=format&fit=crop&w=668&q=80'
  },
  {
    src:
      'https://images.unsplash.com/photo-1516617187286-d719575ac5ee?ixlib=rb-0.3.5&s=73265240c433abe70cf86bdebf8adaa0&auto=format&fit=crop&w=1500&q=80',
    campaign: true
  },
  {
    src:
      'https://images.unsplash.com/photo-1533796846028-7243a1adf748?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fab1a48ac8030aee83bb5bb1a350a3c3&auto=format&fit=crop&w=668&q=80'
  },
  {
    src:
      'https://images.unsplash.com/photo-1533279307053-19f302266ee4?ixlib=rb-0.3.5&s=c5cc78e4b7fd63328bbafc6596ec7126&auto=format&fit=crop&w=1502&q=80'
  },
  {
    src:
      'https://images.unsplash.com/photo-1533359856343-b66cefc8bdd7?ixlib=rb-0.3.5&s=e6f5d8aca61ab3651463fc562d7e61f4&auto=format&fit=crop&w=1500&q=80'
  },
  {
    src:
      'https://images.unsplash.com/photo-1523362289600-a70b4a0e09aa?ixlib=rb-0.3.5&s=805fc983e55a40d945c9cf652106eb80&auto=format&fit=crop&w=668&q=80'
  },
  {
    src:
      'https://images.unsplash.com/photo-1532367680762-34ce09c90768?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f26cf2ba031168676a656e9c3959084b&auto=format&fit=crop&w=668&q=80'
  }
];
/*eslint-disable */
export class Playground extends React.Component<{}, { currentTheme: Theme }> {
  constructor(props: any) {
    super(props);

    this.state = {
      currentTheme: defaultThemeWithNewHomeLayoutComponent
    };
  }

  render() {
    return (
      <ThemeProvider theme={this.state.currentTheme}>
        <Card mb="lg">
          <Button
            onClick={() => {
              this.setState({
                currentTheme:
                  this.state.currentTheme === defaultThemeWithNewHomeLayoutComponent
                    ? customizedTheme
                    : defaultThemeWithNewHomeLayoutComponent
              });
            }}
          >
            Switch theme
          </Button>
        </Card>

        <HomeLayout>
          {images.map(img => (
            <Card key={img.src} variant={img.featured ? 'hero1' : img.campaign ? 'hero2' : ''}>
              <Image src={img.src} />
              <Button mt="lg">Buy now!</Button>
            </Card>
          ))}
        </HomeLayout>
        <ProductLayout mt="lg">
          <Swipeable gridArea="carousel" css={{ height: 250 }}>
            <SwipeableItem
              as={Image}
              src="https://images.unsplash.com/photo-1533359856343-b66cefc8bdd7?ixlib=rb-0.3.5&s=e6f5d8aca61ab3651463fc562d7e61f4&auto=format&fit=crop&w=1500&q=80"
            />
            <Swipeable
              as={Image}
              src="https://images.unsplash.com/photo-1533796846028-7243a1adf748?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fab1a48ac8030aee83bb5bb1a350a3c3&auto=format&fit=crop&w=668&q=80"
            />
            <SwipeableItem
              as={Image}
              src="https://images.unsplash.com/photo-1533359856343-b66cefc8bdd7?ixlib=rb-0.3.5&s=e6f5d8aca61ab3651463fc562d7e61f4&auto=format&fit=crop&w=1500&q=80"
            />
          </Swipeable>
          <Box gridArea="title">
            <H2>Art item </H2>
          </Box>
          <Box gridArea="price">
            <H3>999.99$</H3>
          </Box>
          <Box gridArea="sku">
            <Text>SKU: 211771809</Text>
          </Box>

          <NumberInput gridArea="stepper" defaultValue="1" />
          <Button gridArea="cta">Add to basket</Button>

          <Box gridArea="description">
            <Text>NEW Le Creuset Signature with advanced interior enamel, larger handles and stainless steel knob</Text>
            <Text>
              Le Creuset Cast Iron comes with a Lifetime Guarantee for total peace of mind. The 18cm round casserole is
              ideal for 2 people. Capacity 1.8L
            </Text>
          </Box>
        </ProductLayout>
      </ThemeProvider>
    );
  }
}

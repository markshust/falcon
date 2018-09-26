import React from 'react';
import gql from 'graphql-tag';
import { Link as RouterLink } from 'react-router-dom';
import {
  themed,
  H2,
  H3,
  Text,
  Group,
  Input,
  Button,
  Checkbox,
  Label,
  Link,
  List,
  ListItem,
  Box
} from '@deity/falcon-ui';

import { Query } from './Query';
import { LanguageSwitcher } from './LanguageSwitcher';

export const FooterLayout = themed({
  tag: 'footer',
  defaultTheme: {
    footer: {
      mt: 'lg'
    }
  }
});

const NewsletterLayout = themed({
  tag: 'div',
  defaultTheme: {
    newsletterLayout: {
      bgFullWidth: 'primaryLight',
      py: 'lg',
      display: 'grid',
      gridGap: 'md',
      gridTemplateColumns: '1fr',
      css: {
        maxWidth: 560,
        margin: '0 auto',
        textAlign: 'center'
      }
    }
  }
});

const Newsletter = () => (
  <NewsletterLayout>
    <H2>Newsletter</H2>
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum egestas nisl eu accumsan sodales. Nam semper
      magna vitae enim placerat dictum.
    </Text>

    <form>
      <Group>
        <Input type="email" required />
        <Button as="input" type="submit" value="Subscribe" />
      </Group>
      <Label htmlFor="subscribe" mt="md">
        <Checkbox id="subscribe" required size={16} mr="xs" />I would like to subscribe to updates
      </Label>
    </form>
  </NewsletterLayout>
);

export const CopyrightLayout = themed({
  tag: 'div',

  defaultTheme: {
    copyrightLayout: {
      p: 'md',
      color: 'primaryText',
      bgFullWidth: 'primary',
      css: {
        textAlign: 'center'
      }
    }
  }
});

const FooterSectionsLayout = themed({
  tag: 'div',

  defaultTheme: {
    footerLayout: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
      gridGap: 'md',
      bgFullWidth: 'primaryLight',
      py: 'md',
      css: {
        justifyItems: {
          xs: 'center',
          md: 'center'
        }
      }
    }
  }
});

export const FooterSections: React.SFC<{ sections: any }> = ({ sections }) => (
  <FooterSectionsLayout>
    {sections.map((section: any) => (
      <Box key={section.name} css={{ minWidth: 200 }}>
        <H3>{section.name}</H3>
        <List>
          {section.links.map((item: any) => (
            <ListItem p="sm" key={item.name}>
              <Link as={RouterLink} to={item.url}>
                {item.name}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    ))}
  </FooterSectionsLayout>
);

export const LanguageSection = themed({
  tag: 'div',
  defaultTheme: {
    languageSection: {
      bgFullWidth: 'primaryLight',
      py: 'lg',
      css: {
        maxWidth: 160,
        margin: '0 auto',
        textAlign: 'center',
        zIndex: 2
      }
    }
  }
});
const GET_FOOTER_DATA = gql`
  query {
    footerSections @client
    languages @client
  }
`;

export const Footer = () => (
  <Query query={GET_FOOTER_DATA}>
    {data => (
      <FooterLayout>
        <Newsletter />
        <FooterSections sections={data.footerSections} />
        <LanguageSection>
          <LanguageSwitcher languages={data.languages} />
        </LanguageSection>
        <CopyrightLayout>© Copyright {new Date().getFullYear()}</CopyrightLayout>
      </FooterLayout>
    )}
  </Query>
);

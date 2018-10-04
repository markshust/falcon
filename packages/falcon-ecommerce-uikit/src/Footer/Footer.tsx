import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { H3, Link, List, ListItem, Box, DefaultThemeProps } from '@deity/falcon-ui';
import { LanguageSwitcher } from './LanguageSwitcher';
import { FooterData } from './FooterQuery';
import { Newsletter } from './Newsletter';
import { MenuItem } from '../Header';

const footerLayoutTheme: DefaultThemeProps = {
  footerLayout: {
    mt: 'lg'
  }
};

const copyrightLayoutTheme: DefaultThemeProps = {
  copyrightLayout: {
    p: 'md',
    color: 'primaryText',
    bgFullWidth: 'primary',
    css: {
      textAlign: 'center'
    }
  }
};

const footerSectionsTheme: DefaultThemeProps = {
  footerSectionLayout: {
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
};

export const FooterSections: React.SFC<{ sections: MenuItem[] }> = ({ sections }) => (
  <Box defaultTheme={footerSectionsTheme}>
    {sections.map(section => (
      <Box key={section.name} css={{ minWidth: 200 }}>
        <H3>{section.name}</H3>
        <List>
          {section.children.map(item => (
            <ListItem p="sm" key={item.name}>
              <Link as={RouterLink} to={item.url}>
                {item.name}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    ))}
  </Box>
);

const languageSectionTheme: DefaultThemeProps = {
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
};
export const Footer: React.SFC<FooterData> = ({
  config: {
    menus: { footer },
    languages
  }
}) => (
  <Box as="footer" defaultTheme={footerLayoutTheme}>
    <Newsletter />

    <FooterSections sections={footer} />

    <Box defaultTheme={languageSectionTheme}>
      <LanguageSwitcher languages={languages} />
    </Box>

    <Box defaultTheme={copyrightLayoutTheme}>© Copyright {new Date().getFullYear()}</Box>
  </Box>
);

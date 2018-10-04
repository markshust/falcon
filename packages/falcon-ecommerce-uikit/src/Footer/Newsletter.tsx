import React from 'react';
import { H2, Text, Group, Input, Button, Checkbox, Label, Box, DefaultThemeProps } from '@deity/falcon-ui';

const newsletterLayoutTheme: DefaultThemeProps = {
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
};

export const Newsletter = () => (
  <Box defaultTheme={newsletterLayoutTheme}>
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
  </Box>
);

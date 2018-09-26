import React from 'react';
import { Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem, Box } from '@deity/falcon-ui';

type Language = {
  name: string;
  code: string;
  active: boolean;
};

type LanguageSwitcherProps = {
  languages: Language[];
  onChange?: any;
};

export const LanguageSwitcher: React.SFC<LanguageSwitcherProps> = ({ languages, onChange }) => {
  const activeLanguage = languages.filter(lang => lang.active)[0];

  return (
    <Box display="flex">
      <Dropdown width="100%" onChange={onChange}>
        <DropdownLabel>{activeLanguage.name}</DropdownLabel>

        <DropdownMenu>
          {languages.map(lang => (
            <DropdownMenuItem key={lang.code} value={lang}>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </Box>
  );
};

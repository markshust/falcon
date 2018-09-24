import React from 'react';
import { Dropdown, DropdownLabel, DropdownMenu, DropdownMenuItem, Backdrop, Icon, Box, Portal } from '@deity/falcon-ui';

export class LanguageSwitcher extends React.Component {
  state = {
    open: false
  };

  onChange = lang => () => {
    if (!this.props.onChange) {
      return;
    }
    this.props.onChange(lang);
  };

  render() {
    const { open } = this.state;
    const { languages } = this.props;
    const activeLanguage = languages.filter(lang => lang.active)[0];

    return (
      <Box display="flex">
        <Dropdown width="100%">
          <DropdownLabel active={open} onClick={() => this.setState(state => ({ open: !state.open }))}>
            <span>{activeLanguage.name}</span>
            <Icon src="arrowDown" />
          </DropdownLabel>

          <DropdownMenu open={open}>
            {languages.map(lang => (
              <DropdownMenuItem key={lang.code} onClick={this.onChange(lang)}>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Backdrop as={Portal} variant="transparent" onClick={() => this.setState({ open: false })} visible={open} />
      </Box>
    );
  }
}

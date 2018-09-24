import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './Root';

export class Portal extends React.Component {
  state = { wrapper: null };

  componentDidMount() {
    const wrapper = document.createElement('div');
    document.body.appendChild(wrapper);
    // eslint-disable-next-line
    this.setState({ wrapper });
  }

  componentWillUnmount() {
    const { wrapper } = this.state;
    if (wrapper) {
      document.body.removeChild(wrapper);
    }
  }

  render() {
    const { wrapper } = this.state;
    if (wrapper) {
      return ReactDOM.createPortal(<Root {...this.props} />, wrapper);
    }

    return null;
  }
}

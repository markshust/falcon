import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
// import './styles.scss';

class OfflineOverlay extends Component {
  constructor() {
    super();
    this.state = {
      online: true
    };

    this.updateOnLineStatus = this.updateOnLineStatus.bind(this);
  }

  componentDidMount() {
    window.addEventListener('online', this.updateOnLineStatus);
    window.addEventListener('offline', this.updateOnLineStatus);

    // run detection logic when component mounts as React 16 optimizes too much and doesn't
    // re-render even when SSR html doesn't match client-side
    // more  details: https://github.com/facebook/react/issues/10591
    this.updateOnLineStatus();
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnLineStatus);
    window.removeEventListener('offline', this.updateOnLineStatus);
  }

  updateOnLineStatus() {
    const isOnline = navigator && navigator.onLine;
    if (this.state.online === isOnline) {
      return;
    }

    this.setState({
      online: isOnline
    });
  }

  render() {
    const { t, children } = this.props;
    const { online } = this.state;

    return (
      <div className={online ? 'online' : 'offline'}>
        {!online && <div className="message">{t('common.offline')}</div>}
        {children}
      </div>
    );
  }
}

OfflineOverlay.propTypes = {
  t: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};

export default translate('common')(OfflineOverlay);

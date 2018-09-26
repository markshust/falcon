import React, { Component } from 'react';

const isOnline = () => WrappedComponent => {
  class HOC extends Component {
    constructor(props, context) {
      super(props, context);

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
      const online = navigator && navigator.onLine;
      if (this.state.online === online) {
        return;
      }

      this.setState({
        online
      });
    }

    render() {
      const { online } = this.state;

      return <WrappedComponent online={online} {...this.props} />;
    }
  }

  return HOC;
};

export default isOnline;

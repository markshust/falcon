import { Component } from 'react';
import PropTypes from 'prop-types';
import gtmParts from 'react-google-tag-manager';

export default class GoogleTagManager extends Component {
  componentDidMount() {
    const { dataLayerName, scriptId } = this.props;

    if (!window[dataLayerName]) {
      const gtmScriptNode = document.getElementById(scriptId);

      /* eslint-disable no-eval */
      eval(gtmScriptNode.textContent);
    }
  }

  render() {
    const gtm = gtmParts({
      id: this.props.gtmId,
      dataLayerName: this.props.dataLayerName,
      additionalEvents: this.props.additionalEvents
    });

    if (this.props.noScript) {
      return gtm.noScriptAsReact();
    }

    return gtm.scriptAsReact();
  }
}

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  dataLayerName: PropTypes.string,
  additionalEvents: PropTypes.shape({}),
  scriptId: PropTypes.string,
  noScript: PropTypes.bool
};

GoogleTagManager.defaultProps = {
  dataLayerName: 'dataLayer',
  scriptId: 'react-google-tag-manager-gtm',
  additionalEvents: {}
};

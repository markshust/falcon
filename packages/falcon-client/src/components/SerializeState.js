import React from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';

const SerializeState = ({ variable, value }) => (
  <script
    charSet="UTF-8"
    dangerouslySetInnerHTML={{
      __html: `window.${variable}=${serialize(value || {})}`
    }}
  />
);

SerializeState.propTypes = {
  variable: PropTypes.string.isRequired,
  value: PropTypes.shape({})
};

SerializeState.defaultProps = {
  value: {}
};

export default SerializeState;

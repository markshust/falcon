import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

export default function HtmlHead({ htmlLang }) {
  return (
    <Helmet htmlAttributes={{ lang: htmlLang }}>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
}

HtmlHead.propTypes = {
  htmlLang: PropTypes.string.isRequired
};

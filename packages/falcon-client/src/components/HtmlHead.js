import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import favicon from 'app-path/src/assets/favicon.ico';

export default function HtmlHead({ htmlLang }) {
  return (
    <Helmet htmlAttributes={{ lang: htmlLang }}>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href={favicon} />
    </Helmet>
  );
}

HtmlHead.propTypes = {
  htmlLang: PropTypes.string.isRequired
};

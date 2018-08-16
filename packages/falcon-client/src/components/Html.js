import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import GoogleTagManager from '@hostSrc/google/GoogleTagManager';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  renderGtm(noScript = false) {
    const { gtmCode } = this.props;

    if (gtmCode) {
      return <GoogleTagManager gtmId={gtmCode} noScript={noScript} />;
    }

    return null;
  }

  render() {
    const { assets, state, content, usePwaManifest } = this.props;
    const head = Helmet.rewind();

    return (
      <html lang="en-US">
        <head>
          {this.renderGtm()}
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          {usePwaManifest && <link rel="manifest" href="/manifest.json" />}
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#fff" />
          <meta name="format-detection" content="telephone=no" />
          {assets.client.css && (
            <link
              rel="stylesheet"
              href={assets.client.css}
              type="text/css"
              media="screen, projection"
              charSet="UTF-8"
            />
          )}
        </head>
        <body>
          {this.renderGtm(true)}
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script
            charSet="UTF-8"
            dangerouslySetInnerHTML={{
              __html: `window.__APOLLO_STATE__=${serialize(state)}`
            }}
          />
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.client.js} charSet="UTF-8" async />
          ) : (
            <script src={assets.client.js} charSet="UTF-8" async crossOrigin />
          )}
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  assets: PropTypes.shape({
    client: PropTypes.shape({
      js: PropTypes.string,
      css: PropTypes.string
    })
  }),
  state: PropTypes.shape({}),
  content: PropTypes.string,

  gtmCode: PropTypes.string,
  usePwaManifest: PropTypes.bool
};

Html.defaultProps = {
  assets: {},
  state: {},
  content: '',
  gtmCode: '',
  usePwaManifest: false
};

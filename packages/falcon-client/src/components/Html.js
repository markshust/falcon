import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import GoogleTagManager from '../google/GoogleTagManager';
import SerializeState from './SerializeState';

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
    const { googleTagManager } = this.props.config;

    if (googleTagManager.id) {
      return <GoogleTagManager gtmId={googleTagManager.id} noScript={noScript} />;
    }

    return null;
  }

  render() {
    const { assets, asyncContext, state, i18nextState, content, config } = this.props;
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
          {config.usePwaManifest && <link rel="manifest" href="/manifest.json" />}
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
          <SerializeState variable="__APOLLO_STATE__" value={state} />
          <SerializeState variable="ASYNC_COMPONENTS_STATE" value={asyncContext} />
          <SerializeState variable="I18NEXT_STATE" value={i18nextState} />
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.vendors.js} charSet="UTF-8" async />
          ) : (
            <script src={assets.vendors.js} charSet="UTF-8" async crossOrigin="true" />
          )}
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.client.js} charSet="UTF-8" async />
          ) : (
            <script src={assets.client.js} charSet="UTF-8" async crossOrigin="true" />
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
    }),
    vendors: PropTypes.shape({
      js: PropTypes.string
    })
  }),
  asyncContext: PropTypes.shape({}),
  state: PropTypes.shape({}),
  i18nextState: PropTypes.shape({}),
  content: PropTypes.string,
  config: PropTypes.shape({
    usePwaManifest: PropTypes.bool,
    googleTagManager: PropTypes.shape({})
  })
};

Html.defaultProps = {
  assets: { client: { js: '', css: '' } },
  asyncContext: {},
  state: {},
  i18nextState: {},
  content: '',
  config: {}
};

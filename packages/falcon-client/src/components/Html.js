import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    const { assets, asyncContext, state, helmetContext, i18nextState, config, children } = this.props;
    const { useWebManifest, i18n } = config;

    // const htmlAttrs = helmetContext.htmlAttributes.toComponent();
    // const bodyAttrs = helmetContext.bodyAttributes.toComponent();

    return (
      <html lang={i18nextState.language || i18n.lng}>
        <head>
          {this.renderGtm()}
          {helmetContext && helmetContext.base.toComponent()}
          {helmetContext && helmetContext.title.toComponent()}
          {helmetContext && helmetContext.meta.toComponent()}
          {helmetContext && helmetContext.link.toComponent()}
          {helmetContext && helmetContext.script.toComponent()}
          {useWebManifest && <link rel="manifest" href={assets.webpanifest} type="application/manifest+json" />}
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#fff" />
          <meta name="format-detection" content="telephone=no" />
          {assets.clientCss && (
            <link rel="stylesheet" href={assets.clientCss} type="text/css" media="screen, projection" charSet="UTF-8" />
          )}
        </head>
        <body>
          {this.renderGtm(true)}

          <div id="root">{children}</div>

          <SerializeState variable="__APOLLO_STATE__" value={state} />
          <SerializeState variable="ASYNC_COMPONENTS_STATE" value={asyncContext} />
          <SerializeState variable="I18NEXT_STATE" value={i18nextState} />
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.vendorsJs} charSet="UTF-8" async />
          ) : (
            <script src={assets.vendorsJs} charSet="UTF-8" async crossOrigin="true" />
          )}
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.clientJs} charSet="UTF-8" async />
          ) : (
            <script src={assets.clientJs} charSet="UTF-8" async crossOrigin="true" />
          )}
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  children: PropTypes.node,
  assets: PropTypes.shape({
    clientJs: PropTypes.string,
    clientCss: PropTypes.string,
    vendorsJs: PropTypes.string,
    webmanifest: PropTypes.string
  }),
  asyncContext: PropTypes.shape({}),
  helmetContext: PropTypes.shape({}),
  state: PropTypes.shape({}),
  i18nextState: PropTypes.shape({
    language: PropTypes.string,
    data: PropTypes.shape({})
  }),
  config: PropTypes.shape({
    usePwaManifest: PropTypes.bool,
    googleTagManager: PropTypes.shape({})
  })
};

Html.defaultProps = {
  assets: { clientJs: '', clientCss: '', vendorsJs: '', webmanifest: '' },
  asyncContext: {},
  state: {},
  i18nextState: {},
  config: {}
};

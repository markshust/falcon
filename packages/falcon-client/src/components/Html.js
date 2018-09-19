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
    const { googleTagManager } = this.props;

    if (googleTagManager.id) {
      return <GoogleTagManager gtmId={googleTagManager.id} noScript={noScript} />;
    }

    return null;
  }

  render() {
    const { assets, children, helmetContext, state, asyncContext, i18nextState } = this.props;

    return (
      <html lang="en" {...helmetContext.htmlAttributes.toComponent()}>
        <head>
          {helmetContext.base.toComponent()}
          {helmetContext.title.toComponent()}
          {helmetContext.meta.toComponent()}
          {helmetContext.link.toComponent()}
          {helmetContext.script.toComponent()}

          {this.renderGtm()}

          {assets.webmanifest && <link rel="manifest" href={assets.webmanifest} type="application/manifest+json" />}
          {assets.clientCss && (
            <link rel="stylesheet" href={assets.clientCss} type="text/css" media="screen, projection" charSet="UTF-8" />
          )}
        </head>
        <body {...helmetContext.bodyAttributes.toComponent()}>
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
  helmetContext: PropTypes.shape({}).isRequired,
  assets: PropTypes.shape({
    clientJs: PropTypes.string,
    clientCss: PropTypes.string,
    vendorsJs: PropTypes.string,
    webmanifest: PropTypes.string
  }),
  state: PropTypes.shape({}),
  asyncContext: PropTypes.shape({}),
  i18nextState: PropTypes.shape({
    language: PropTypes.string,
    data: PropTypes.shape({})
  }),
  googleTagManager: PropTypes.shape({})
};

Html.defaultProps = {
  assets: { clientJs: '', clientCss: '', vendorsJs: '', webmanifest: '' },
  asyncContext: {},
  state: {},
  i18nextState: {},
  googleTagManager: {}
};

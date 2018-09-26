import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import logo from 'src/assets/logo.png';
import './Home.css';

const Home = props => {
  const { t } = props;

  return (
    <div className="Home">
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>{t('welcome')}</h2>
      </div>
      <pre className="Home-intro">
        To get started, edit <b>src/App.js</b> or <b>src/Home.js</b> and save to reload.
      </pre>
      <Query
        query={gql`
          query Hi {
            hi @client
          }
        `}
      >
        {({ data: { hi } }) => (
          <pre>
            Saying <b>{hi}</b> from the Client State!
          </pre>
        )}
      </Query>
      <ul className="Home-resources">
        <li>
          <Link to="/abc">abc</Link>
        </li>
        <li>
          <Link to="/post">Post (dynamic)</Link>
        </li>
        <li>
          <Link to="/shop">Shop (dynamic)</Link>
        </li>
      </ul>
    </div>
  );
};
Home.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate()(Home);

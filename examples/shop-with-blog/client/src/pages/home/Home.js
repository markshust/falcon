import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import logo from './../../../public/logo.png';
import './Home.css';

const Home = () => (
  <div className="Home">
    <div className="Home-header">
      <img src={logo} className="Home-logo" alt="logo" />
      <h2>Welcome to @deity + Razzle + Koa </h2>
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
      {({ data: { hi } }) => <pre>Saying `{hi}` from the Client State!</pre>}
    </Query>
    <ul className="Home-resources">
      <li>
        <a href="https://github.com/jaredpalmer/razzle">Docs</a>
      </li>
      <li>
        <a href="http://koajs.com">Koa official site</a>
      </li>
      <li>
        <a href="https://github.com/jaredpalmer/razzle/issues">Issues</a>
      </li>
      <li>
        <a href="https://palmer.chat">Community Slack</a>
      </li>
    </ul>
  </div>
);

export default Home;

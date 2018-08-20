import React from 'react';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const query = gql`
  query GetUrl($url: String!) {
    getUrl(url: $url) {
      type
      url
    }
  }
`;

const DynamicRoute = props => {
  const {
    components,
    location: { pathname }
  } = props;

  return (
    <Query query={query} variables={{ url: pathname }}>
      {({ loading, data: { getUrl } }) =>
        loading ? <p>Loading...</p> : <Route path="/*" component={components[getUrl.type]} />
      }
    </Query>
  );
};

DynamicRoute.propTypes = {
  components: PropTypes.shape({}),
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

export default DynamicRoute;

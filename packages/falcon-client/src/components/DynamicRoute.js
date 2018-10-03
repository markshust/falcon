import React from 'react';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_URL } from '../graphql/url.gql';
import NotFoundRoute from './NotFoundRoute';

const DynamicRoute = props => {
  const {
    components,
    location: { pathname }
  } = props;

  return (
    <Query query={GET_URL} variables={{ url: pathname }}>
      {({ loading, error, data: { url } }) => {
        if (loading) {
          return <p>Loading...</p>;
        }

        if (error) {
          throw error;
        }

        if (!url) {
          return <NotFoundRoute />;
        }

        return <Route path="/*" component={components[url.type]} />;
      }}
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

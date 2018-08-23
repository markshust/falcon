import React from 'react';
import Route from 'react-router-dom/Route';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { GET_URL } from 'falcon-client/src/graphql/url.gql';

const DynamicRoute = props => {
  const {
    components,
    location: { pathname }
  } = props;

  return (
    <Query query={GET_URL} variables={{ url: pathname }}>
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

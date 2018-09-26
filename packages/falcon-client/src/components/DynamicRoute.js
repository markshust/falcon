import React from 'react';
import Redirect from 'react-router-dom/Redirect';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { asyncComponent } from 'react-async-component';

function isPromise(object) {
  if (Promise && Promise.resolve) {
    return Promise.resolve(object) === object;
  }
  throw new Error('Promise not supported in your environment');
}

const Loader = () => <p>Loading...</p>;
const Error500 = ({ message }) => (
  <div>
    <p>Error!</p>
    <p>{message}</p>
  </div>
);

const DynamicRoute = props => {
  const { components, match } = props;
  const path = match.params[0];

  return (
    <Query
      query={gql`
        query URL($path: String!) {
          url(path: $path) {
            id
            path
            type
          }
        }
      `}
      variables={{ path }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />;
        }

        if (error) {
          return <Error500 message={error.message} />;
        }

        if (!data || data.url === null) {
          return <Redirect to="/not-found" />;
        }

        const { type } = data.url;
        const component = components[type];
        if (!component) {
          return null;
        }

        if (isPromise(component)) {
          return React.createElement(
            asyncComponent({
              resolve: () => component,
              LoadingComponent: Loader,
              ErrorComponent: Error500
            }),
            { ...data.url }
          );
        }

        return React.createElement(component, { ...data.url });
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

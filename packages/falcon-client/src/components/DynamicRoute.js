import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Query from './Query';
import { GET_URL } from './../graphql/url.gql';

const DynamicRoute = ({ components, location, loaderComponent, errorComponent }) => {
  const { pathname } = location;
  const path = pathname.startsWith('/') ? pathname.substring(1) : pathname;

  return (
    <Query query={GET_URL} variables={{ path }} loaderComponent={loaderComponent} errorComponent={errorComponent}>
      {({ data }) => {
        if (!data || data.url === null) {
          return <p>not found</p>;
        }

        const { url } = data;
        if (url.redirect) {
          return <Redirect to={`/${url.path}`} />;
        }

        const component = components[url.type];
        if (!component) {
          return <p>{`Please register component for '${url.type}' content type!`}</p>;
        }

        return React.createElement(component, { id: url.id, path: url.path });
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

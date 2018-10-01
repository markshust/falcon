import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Query from './Query';

export const GET_URL = gql`
  query URL($path: String!) {
    url(path: $path) {
      type
      redirect
      id
      path
    }
  }
`;

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
          return null;
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

// export const DynamicSwitch = props => {
//   const { components, location } = props;
//   const { pathname } = location;
//   const path = pathname.startsWith('/') ? pathname.substring(1) : pathname;

//   return (
//     <Query query={GET_URL} variables={{ path }}>
//       {({ loading, error, data }) => {
//         if (loading) {
//           return <Loader />;
//         }

//         if (!data || data.url === null) {
//           return <p>not found</p>;
//         }

//         const { url } = data;
//         if (url.redirect) {
//           return <Redirect to={`/${url.path}`} />;
//         }

//         const component = components[url.type];
//         if (!component) {
//           return null;
//         }

//         return <Switch location={{ pathname: `${url.path}?id=${url.id}` }}>{props.children}</Switch>;
//         // return React.createElement(
//         //   asyncComponent({
//         //     resolve: component,
//         //     LoadingComponent: Loader,
//         //     ErrorComponent: Error500
//         //   }),
//         //   {
//         //     id: url.id,
//         //     path: url.path
//         //   }
//         // );
//         // }
//       }}
//     </Query>
//   );
// };

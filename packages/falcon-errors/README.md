# Falcon Error meta-package

```javascript

import NotFoundRoute from '@deity/falcon-client/src/components/NotFoundRoute';

<Query
  query={gql`
    {
      url(path: "foo") {
        id
        type
      }
    }
  `}
>
  {({ error, { url }) => {
    // If you want the whole page to "fail" on client-side request - you should re-throw the exception
    // returned by Apollo Query component. If not - you can manually check the returned data and show an error message.
    // The `error` exception will be re-thrown by Falcon Client automatically for
    // `config.serverSideRendering = true` and initial page hit.
    if (error) {
      throw error;
    }

    // You have a full control over this logic
    if (!url) {
      // return <NotFoundRoute />;
      return <div>Page not found</div>;
    }

    /* if (!data || !data.url) {
      throw new EntityNotFoundError('URL not found');
    } */

    return <div>Loaded successfully!</div>;
  }}
</Query>
```
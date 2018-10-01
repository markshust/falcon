import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Breadcrumbs as BreadcrumbsLayout, Breadcrumb, Link } from '@deity/falcon-ui';

export const Breadcrumbs: React.SFC<{ breadcrumbs: any }> = ({ breadcrumbs }) => (
  <BreadcrumbsLayout>
    {breadcrumbs.map((breadcrumb: any, index: number) => (
      <Breadcrumb key={breadcrumb.name} current={breadcrumbs.length - 1 === index}>
        <Link as={RouterLink} to={breadcrumb.urlPath}>
          {breadcrumb.name}
        </Link>
      </Breadcrumb>
    ))}
  </BreadcrumbsLayout>
);

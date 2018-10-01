import React from 'react';
// import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { CategoryQuery, Category } from '@deity/falcon-ecommerce-uikit';

const CategoryPage = ({ id }) => (
  <CategoryQuery variables={{ categoryId: id }}>{categoryProps => <Category {...categoryProps} />}</CategoryQuery>
);
CategoryPage.propTypes = {
  id: PropTypes.number.isRequired
};

export default CategoryPage;

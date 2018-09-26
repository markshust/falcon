import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const Category = ({ id, path, type, t }) => (
  <div>
    <h1>{t('category.title')}</h1>
    <p>{`type: ${type}`}</p>
    <p>{`id: ${id}`}</p>
    <p>{`path: ${path}`}</p>
  </div>
);
Category.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate('shop')(Category);

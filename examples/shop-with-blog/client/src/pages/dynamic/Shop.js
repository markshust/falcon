import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const Shop = ({ t }) => (
  <div>
    <h1>{t('title')}</h1>
  </div>
);
Shop.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate('shop')(Shop);

import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const Cms = ({ id, path, type, t }) => (
  <div>
    <h1>{t('cms.title')}</h1>
    <p>{`type: ${type}`}</p>
    <p>{`id: ${id}`}</p>
    <p>{`path: ${path}`}</p>
  </div>
);
Cms.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate('shop')(Cms);

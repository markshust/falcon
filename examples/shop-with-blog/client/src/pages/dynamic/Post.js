import React from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

const Post = ({ t }) => (
  <div>
    <h1>{t('title')}</h1>
    <h2>{t('welcome')}</h2>
  </div>
);
Post.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate(['common', 'post'])(Post);

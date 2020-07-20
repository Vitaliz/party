import React from 'react';
import PropTypes from 'prop-types';

import Core from '../core';

/**
 * Stage default
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageDefault = (/*{ game }*/) => {
  return (
    <div></div>
  );
};

StageDefault.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageDefault;

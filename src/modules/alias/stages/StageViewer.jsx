import React from 'react';
import PropTypes from 'prop-types';

import AliasPostfix from '../components/AliasPostfix';

import Core from '../core';

/**
 * Stage viewer
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageViewer = ({ game }) => {
  return (
    <AliasPostfix
      description="Сейчас играют"
    >
      {game.current.item.team}
    </AliasPostfix>
  );
};

StageViewer.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageViewer;

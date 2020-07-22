import React from 'react';
import PropTypes from 'prop-types';

import AliasPostfix from '../components/AliasPostfix';

import Core from '../core';

/**
 * Stage default
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageMember = ({ game }) => {
  return (
    <AliasPostfix
      description="Сейчас играет"
    >
      {game.current.item.team}
    </AliasPostfix>
  );
};

StageMember.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageMember;

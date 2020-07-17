import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';

import { useUnmount } from '../../../hooks/base';
import { useStore } from '../../../hooks/store';
import Core from '../core';

/**
 * Play screen
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const AliasPlay = ({ /* game, */ id }) => {
  const store = useStore();
  useUnmount(() => {
    store.game = {};
  });

  return (
    <GradientPanel
      id={id}
      title="Команды"
      color="yellow"
    >

    </GradientPanel>
  );
};

AliasPlay.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasPlay;

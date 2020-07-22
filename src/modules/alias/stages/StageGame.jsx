import React from 'react';
import PropTypes from 'prop-types';

import Cards from '../components/Cards';

import Core from '../core';

const CARDS_MOCK1 = [
  '1',
  '2',
  '3',
  '4',
  '9',
  '10',
  '11',
  '12'
];


/**
 * Stage game
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageGame = ({ game }) => {

  const saveAnswer = (name, success) => {
    game.answers.push({
      name,
      success
    });
  };

  const onAccept = (name) => {
    saveAnswer(name, true);
  };

  const onDismiss = (name) => {
    saveAnswer(name, false);
  };

  return (
    <Cards
      cards={CARDS_MOCK1}
      onAccept={onAccept}
      onDismiss={onDismiss}
    />
  );
};

StageGame.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageGame;

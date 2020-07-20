import React from 'react';
import PropTypes from 'prop-types';

import Cards from '../components/Cards';

import { useState, useUnmount } from '../../../hooks/base';

import Core from '../core';

const CARDS_MOCK = [
  '1',
  '2',
  '3',
  '4'
];

/**
 * Stage game
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageGame = ({ game }) => {
  const [cards, setCards] = useState(() => CARDS_MOCK);
  const [points, setPoints] = useState(0);

  useUnmount(() => {
    game.points(points);
  });

  const onAccept = () => {
    setPoints((points) => points + 1);
  };

  const onDismiss = () => {
    if (game.settings.away) {
      setPoints((points) => points - 1);
    }
  };

  const resetCards = () => {
    setCards([...CARDS_MOCK]);
  };

  return (
    <Cards
      cards={cards}
      onAccept={onAccept}
      onDismiss={onDismiss}
      onDone={resetCards}
    />
  );
};

StageGame.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageGame;

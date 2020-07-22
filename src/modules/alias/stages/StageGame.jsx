import React from 'react';
import PropTypes from 'prop-types';

import Countdown from 'react-countdown';
import Cards from '../components/Cards';
import AliasAffix from '../components/AliasAffix';
import Timer from '../../../components/Timer';

import { useCompute, useMemo, useForceUpdate } from '../../../hooks/base';

import { secondsToTime } from '../../../utils/date';

import Core from '../core';

/**
 * Stage game
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageGame = ({ game }) => {
  const update = useForceUpdate();

  const cards = useCompute(() => {
    return game.questions;
  });

  const saveAnswer = (name, success) => {
    game.answers.push({
      name,
      success
    });
    update();
  };

  const onAccept = (name) => {
    saveAnswer(name, true);
  };

  const onDismiss = (name) => {
    saveAnswer(name, false);
  };

  const count = useCompute(() => {
    const team = game.settings.teams.find((team) => {
      return team.peers.includes(game.id);
    });
    const before = team.points;
    const points = game.answers.reduce((acc, answer) => {
      if (answer.success) {
        ++acc;
      } else {
        if (game.settings.away) {
          --acc;
        }
      }
      return acc;
    }, 0);
    const current = points < 0 ? 0 : points;
    const total = before + current;

    return `${total} \\ ${game.settings.point}`;
  });

  const time = useMemo(() => {
    return Date.now() + secondsToTime(game.settings.time);
  }, [game]);

  return (
    <>
      <AliasAffix>
        <Countdown
          key={game.id}
          renderer={Timer}
          date={time}
        />
        <span>{count}</span>
      </AliasAffix>
      <Cards
        cards={cards}
        onAccept={onAccept}
        onDismiss={onDismiss}
      />
    </>
  );
};

StageGame.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageGame;

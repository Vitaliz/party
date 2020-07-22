import React from 'react';
import PropTypes from 'prop-types';

import ThemedButton from '../../../components/common/ThemedButton';
import { FixedLayout, Div } from '@vkontakte/vkui';
import AliasAffix from '../components/AliasAffix';
import AliasPostfix from '../components/AliasPostfix';
import TeamAffix from '../components/TeamAffix';
import Counter from '../../../components/Counter';
import MirrorHill from '../../../components/MirrorHill';

import { useCompute } from '../../../hooks/base';

import Core from '../core';

/**
 * Stage default
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageStart = ({ game }) => {
  const teams = useCompute(() => {
    if (!game.settings.teams) {
      return null;
    }

    return game.settings.teams.map((team) => {
      return (
        <TeamAffix key={team.name}>
          <span>{team.name}</span>
          <Counter $color="yellow">
            {team.points}
          </Counter>
        </TeamAffix>
      );
    });
  });

  const currentTeam = useCompute(() => {
    return game.current.item.team;
  });

  const currentRound = useCompute(() => {
    if (!game.settings.teams) {
      return null;
    }

    const oneLoop = game.settings.teams.reduce((acc, team) => {
      return acc + team.peers.length;
    }, 0);

    const round = Math.floor(game.current.lap % oneLoop) + 1;
    const loop = Math.floor(game.current.lap / oneLoop) + 1;

    return `Раунд ${round} \\ Круг ${loop}`;
  });

  const startGame = () => {
    game.start();
  };

  return (
    <>
      <AliasAffix>
        <span>Для победы</span>
        <Counter $color="white">{game.settings.point}</Counter>
      </AliasAffix>
      <MirrorHill>
        {teams}
      </MirrorHill>
      <AliasPostfix
        description={currentRound}
      >
        {currentTeam}
      </AliasPostfix>
      <FixedLayout
        vertical="bottom"
      >
        <Div>
          <ThemedButton
            $color="yellow"
            $overlay={true}
            onClick={startGame}
          >
            Начать
          </ThemedButton>
        </Div>
      </FixedLayout>
    </>
  );
};

StageStart.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageStart;

import React from 'react';
import PropTypes from 'prop-types';

import ThemedButton from '../../../components/common/ThemedButton';
import AliasAffix from '../components/AliasAffix';
import TeamAffix from '../components/TeamAffix';
import Counter from '../../../components/Counter';
import MirrorHill from '../../../components/MirrorHill';

import { useCompute } from '../../../hooks/base';

import Core from '../core';
import { FixedLayout, Div } from '@vkontakte/vkui';

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
      <FixedLayout>
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

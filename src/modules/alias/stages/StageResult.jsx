import React from 'react';
import PropTypes from 'prop-types';

import ThemedButton from '../../../components/common/ThemedButton';
import Row from '../../../components/common/Row';
import { FixedLayout } from '@vkontakte/vkui';
import AliasAffix from '../components/AliasAffix';
import AliasPostfix from '../components/AliasPostfix';
import TeamAffix from '../components/TeamAffix';
import Counter from '../../../components/Counter';
import MirrorHill from '../../../components/MirrorHill';

import { useCompute } from '../../../hooks/base';
import { useBus } from '../../../hooks/util';

import Core from '../core';

/**
 * Stage default
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageResult = ({ game }) => {
  const bus = useBus();

  const newGame = () => {
    bus.emit('app:view', 'alias-prepare');
  };

  const closeGame = () => {
    bus.emit('app:view', 'home');
  };

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
    if (!game.settings.teams) {
      return null;
    }

    const team = game.settings.teams.find((team) => {
      return team.points >= game.settings.point;
    });

    if (!team) {
      return null;
    }

    return team.name;
  });

  const isHost = useCompute(() => {
    return game.id === game.host;
  });

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
        description="Победила команда"
      >
        {currentTeam}
      </AliasPostfix>
      <FixedLayout
        vertical="bottom"
      >
        <Row>
          {
            isHost && (
              <ThemedButton
                $color="yellow"
                $overlay={true}
                stretched={isHost}
                onClick={newGame}
              >
                Новая игра
              </ThemedButton>
            )
          }
          <ThemedButton
            $color="yellow"
            $overlay={true}
            stretched={isHost}
            onClick={closeGame}
          >
            Закрыть
          </ThemedButton>
        </Row>
      </FixedLayout>
    </>
  );
};

StageResult.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageResult;

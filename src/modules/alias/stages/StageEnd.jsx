import React from 'react';
import PropTypes from 'prop-types';

import AliasAffix from '../components/AliasAffix';
import TeamAffix from '../components/TeamAffix';
import Counter from '../../../components/Counter';
import MirrorHill from '../../../components/MirrorHill';

import { useCompute } from '../../../hooks/base';

import Core from '../core';

/**
 * Stage end
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageEnd = ({ game }) => {
  const teams = useCompute(() => {
    if (!game.settings.teams) {
      return null;
    }

    const team = game.settings.teams.find((team) => {
      return team.users.some((user) => {
        return +user.vkUserId === game.id;
      });
    });

    if (!team) {
      return null;
    }

    return (
      <TeamAffix key={team.name}>
        <span>{team.name}</span>
        <Counter $color="yellow">{team.points}</Counter>
      </TeamAffix>
    );
  });

  return (
    <>
      <AliasAffix>
        <span>Результаты раунда</span>
      </AliasAffix>
      <MirrorHill>
        {teams}
      </MirrorHill>
    </>
  );
};

StageEnd.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageEnd;

import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import QRModal from '../../../components/overlay/QRModal';
import TeamCard from '../components/TeamCard';

import { useCompute, useForceUpdate, useImmutableCallback, useMount, useUnmount } from '../../../hooks/base';
import { useModal } from '../../../hooks/overlay';

import Core from '../core';
import { generateInviteLink } from '../../../utils/uri';

/**
 * Join screen
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const AliasJoin = ({ game, id, goBack }) => {
  const modal = useModal();

  const update = useForceUpdate();

  useMount(() => {
    game.attach(update);
  });

  useUnmount(() => {
    game.detach(update);
  });

  const joinTeam = (name) => {
    game.join(name);
  };

  const maxUsersInTeam = useCompute(() => {
    if (!game.settings.teams) {
      return 0;
    }
    return Math.ceil((game.connections.size + 1) / game.settings.teams.length);
  });

  const renderTeams = useCompute(() => {
    if (!game.settings.teams) {
      return null;
    }
    return game.settings.teams.map((team) => {
      const checked = team.users.some((user) => {
        return user.vkUserId === +game.peer.id;
      });
      return (
        <TeamCard
          key={team.name}
          name={team.name}
          onClick={joinTeam}
          checked={checked}
          max={maxUsersInTeam}
          users={team.users}
        />
      );
    });
  });

  const showQR = useImmutableCallback(() => {
    const link = generateInviteLink('alias', game.peer.id);

    modal.show(() => (
      <QRModal link={link} color="yellow" />
    ));
  });

  return (
    <GradientPanel
      id={id}
      onBack={goBack}
      title="Лобби"
      color="yellow"
    >
      {renderTeams}
      <ThemedButton
        $color="yellow"
        $overlay={true}
        onClick={showQR}
      >
        Пригласить
      </ThemedButton>
    </GradientPanel>
  );
};

AliasJoin.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasJoin;

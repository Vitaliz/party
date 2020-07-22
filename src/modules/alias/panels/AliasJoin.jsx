import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import QRModal from '../../../components/overlay/QRModal';
import TeamCard from '../components/TeamCard';
import { ScreenSpinner } from '@vkontakte/vkui';

import { useCompute, useForceUpdate, useImmutableCallback, useMount, useUnmount, useLayoutEffect } from '../../../hooks/base';
import { useModal, usePopout, useClearOverlay } from '../../../hooks/overlay';

import Core from '../core';
import { generateInviteLink } from '../../../utils/uri';

/**
 * Join screen
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const AliasJoin = ({ game, id, goBack, goForward }) => {
  const clearOverlay = useClearOverlay();
  const modal = useModal();
  const popout = usePopout();

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

  const canStart = useCompute(() => {
    if (game.host === game.id) {
      if (!game.settings.teams) {
        return false;
      }

      const peersCount = game.connections.size;
      const usersCount = peersCount + 1;

      const isMinimal = usersCount >= game.settings.teams.length;
      if (!isMinimal) {
        return false;
      }

      const isSynchronized = game.sync.size >= peersCount;
      if (!isSynchronized) {
        return false;
      }

      const isJoined = game.settings.teams.reduce((acc, team) => {
        acc += team.users.length;
        return acc;
      }, 0) >= usersCount;
      if (!isJoined) {
        return false;
      }

      return true;
    }

    const isJoined = game.settings.teams &&
      game.settings.teams.some((team) => {
        return team.peers.includes(game.id);
      });

    return isJoined;
  });

  const startGame = () => {
    clearOverlay(() => {
      popout.show(() => (
        <ScreenSpinner />
      ));

      game.ready();
    });
  };

  const maxUsersInTeam = useCompute(() => {
    return game.maxUsersInTeam();
  });

  const renderTeams = useCompute(() => {
    if (!game.settings.teams) {
      return null;
    }

    return game.settings.teams.map((team) => {
      const checked = team.peers.includes(game.id);

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
    const link = generateInviteLink('alias', game.host);

    modal.show(() => (
      <QRModal link={link} color="yellow" />
    ));
  });

  useLayoutEffect(() => {
    if (game.stage !== null) {
      window.requestAnimationFrame(() => {
        clearOverlay(() => {
          goForward();
        });
      });
    }
  });

  return (
    <GradientPanel
      id={id}
      onClose={goBack}
      title="Лобби"
      color="yellow"
      postfix={(
        <>
          {
            canStart && (
              <ThemedButton
                $color="yellow"
                $overlay={true}
                onClick={startGame}
              >
                Начать
              </ThemedButton>
            )
          }
          <ThemedButton
            $color="yellow"
            $overlay={true}
            onClick={showQR}
          >
            Пригласить
          </ThemedButton>
        </>
      )}
    >
      {renderTeams}
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

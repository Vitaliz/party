import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import TeamButton from '../components/TeamButton';
import TeamEditor from '../components/TeamEditor';
import { FormLayout } from '@vkontakte/vkui';

import { useImmutableCallback, useMemo, useState, useCompute } from '../../../hooks/base';
import { usePopout } from '../../../hooks/overlay';
import { useStore } from '../../../hooks/store';

import { randomElements } from '../../../utils/data';
import { NAMES } from '../../../utils/constants';

const randomTeams = randomElements(NAMES, 2).map((name) => ({ name }));

const AliasTeams = ({ id, goBack, goForward }) => {
  const store = useStore();
  const popout = usePopout();

  const [teams, setTeams] = useState(() => store.game.teams || randomTeams);

  const canStart = useCompute(() => {
    return teams.length >= 2 && teams.length <= 12;
  });

  const openJoin = () => {
    if (!canStart) {
      return;
    }

    store.game.teams = teams;
    goForward('join');
  };

  const saveTeam = useImmutableCallback((oldName, newName) => {
    setTeams((teams) => {
      const has = teams.some((team) => {
        return team.name === newName;
      });

      if (has) {
        return teams;
      }

      if (oldName === '') {
        return [...teams, { name: newName }];
      }

      return teams.map((team) => {
        if (team.name === oldName) {
          team.name = newName;
        }
        return team;
      });
    });
  });

  const removeTeam = useImmutableCallback((name) => {
    setTeams((teams) => {
      return teams.filter((team) => {
        return team.name !== name;
      });
    });
  });

  const openEditor = useImmutableCallback((name) => {
    popout.show((context) => (
      <TeamEditor
        edit={name}
        onClose={context.onClose}
        onSave={saveTeam}
        onRemove={removeTeam}
      />
    ));
  });

  const renderTeams = useMemo(() => {
    if (teams.length === 0) {
      return null;
    }
    return teams.map((team) => {
      return (
        <TeamButton
          key={team.name}
          onClick={openEditor.bind(null, team.name)}
        >
          {team.name}
        </TeamButton>
      );
    });
  }, [teams]);

  return (
    <GradientPanel
      id={id}
      onBack={goBack}
      title="Команды"
      color="yellow"
      postfix={(
        <ThemedButton
          $color="yellow"
          $overlay={true}
          disabled={!canStart}
          onClick={openJoin}
        >
          Далее
        </ThemedButton>
      )}
    >
      <FormLayout>
        {renderTeams}
        <TeamButton
          $unelevated={true}
          onClick={openEditor.bind(null, '')}
        >
          &#43; Добавить команду
        </TeamButton>
      </FormLayout>
    </GradientPanel>
  );
};

AliasTeams.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasTeams;

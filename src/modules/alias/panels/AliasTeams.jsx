import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import TeamButton from '../components/TeamButton';
import TeamEditor from '../components/TeamEditor';
import { FormLayout } from '@vkontakte/vkui';

import { useImmutableCallback, useMemo, useState, useMount } from '../../../hooks/base';
import { usePopout } from '../../../hooks/overlay';
import { useStore } from '../../../hooks/store';

const AliasTeams = ({ id, goBack, goForward }) => {
  const store = useStore();
  const popout = usePopout();

  const [teams, setTeams] = useState(() => store.game.teams || []);

  const openJoin = () => {
    store.game.teams = teams;

    goForward('join');
  };

  const saveTeam = useImmutableCallback((oldName, newName) => {
    setTeams((teams) => {
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

  useMount(() => {
    if (teams.length === 0) {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            openEditor('');
          });
        }, 600);
      });
    }
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
      <ThemedButton
        $color="yellow"
        $overlay={true}
        onClick={openJoin}
      >
        Далее
      </ThemedButton>
    </GradientPanel>
  );
};

AliasTeams.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasTeams;

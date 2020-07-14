import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import Team from '../components/Team';
import TeamEditor from '../components/TeamEditor';
import { Button } from '@vkontakte/vkui';

import { useImmutableCallback, useDeepMemo, useState, useMount } from '../../../hooks/base';
import { useModal } from '../../../hooks/overlay';

const AliasTeams = ({ id, goBack, goForward }) => {
  const modal = useModal();
  const [teams, setTeams] = useState([]);

  const saveTeam = useImmutableCallback((oldName, newName) => {
    setTeams((teams) => {
      if (oldName === '') {
        return [...teams, { name: newName, users: [] }];
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
    modal.show(
      <TeamEditor
        edit={name}
        onSave={saveTeam}
        onRemove={removeTeam}
      />
    );
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

  const renderTeams = useDeepMemo(() => {
    if (teams.length === 0) {
      return null;
    }
    return teams.map((team) => {
      const avatars = team.users.map((user) => {
        return user.avatar;
      });

      return (
        <Team
          key={team.name}
          avatars={avatars}
          onClick={openEditor.bind(null, team.name)}
        >
          {team.name}
        </Team>
      );
    });
  }, [teams]);

  const openJoin = useImmutableCallback(() => {
    goForward('join');
  });

  return (
    <GradientPanel
      id={id}
      onBack={goBack}
      title="Команды"
      color="yellow"
    >
      {renderTeams}
      <Button
        size="xl"
        mode="tertiary"
        onClick={openEditor.bind(null, '')}
      >
        &#43; Добавить команду
      </Button>
      <button onClick={openJoin}>Далее</button>
    </GradientPanel>
  );
};

AliasTeams.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasTeams;

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import Tabs from '../components/Tabs';
import Checkbox from '../components/Checkbox';
import { TabsItem, Headline, Group } from '@vkontakte/vkui';

import { useState, useMemo, useImmutableCallback } from '../../../hooks/base';
import { useStore } from '../../../hooks/store';

const TIME = [60, 90, 120, 150, 180];
const POINT = [25, 50, 75, 100, 150];

const Header = styled(Headline).attrs(() => ({
  weight: 'semibold'
}))`
  color: #fff;
`;

const AliasSettings = ({ id, goBack, goForward }) => {
  const store = useStore();

  const [time, setTime] = useState(() => store.game.time || TIME[0]);
  const [point, setPoint] = useState(() => store.game.point || POINT[0]);
  const [away, setAway] = useState(() => store.game.away || false);

  const openTeams = () => {
    store.game.time = time;
    store.game.point = point;
    store.game.away = away;

    goForward('teams');
  };

  const timeTabs = useMemo(() => {
    const current = time;

    return TIME.map((time) => {
      return (
        <TabsItem
          key={time}
          selected={current === time}
          onClick={setTime.bind(null, time)}
        >
          {time}
        </TabsItem>
      );
    });
  }, [time]);

  const pointTabs = useMemo(() => {
    const current = point;

    return POINT.map((point) => {
      return (
        <TabsItem
          key={point}
          selected={current === point}
          onClick={setPoint.bind(null, point)}
        >
          {point}
        </TabsItem>
      );
    });
  }, [point]);

  const onChange = useImmutableCallback((e) => {
    setAway(e.target.checked);
  });

  return (
    <GradientPanel
      id={id}
      onClose={goBack}
      title="Настройки"
      color="yellow"
      postfix={(
        <ThemedButton
          $color="yellow"
          $overlay={true}
          onClick={openTeams}
        >
          Далее
        </ThemedButton>
      )}
    >
      <Group
        header={<Header>Длительность раунда</Header>}
        separator="hide"
      >
        <Tabs>
          {timeTabs}
        </Tabs>
      </Group>
      <Group
        header={<Header>Очков для победы</Header>}
        separator="hide"
      >
        <Tabs>
          {pointTabs}
        </Tabs>
      </Group>
      <Checkbox
        checked={away}
        onChange={onChange}
      >
        Каждое пропущенное слово отнимает очки
      </Checkbox>
    </GradientPanel>
  );
};

AliasSettings.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasSettings;

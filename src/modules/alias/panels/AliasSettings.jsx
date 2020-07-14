import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import Tabs from '../components/Tabs';
import Checkbox from '../components/Checkbox';
import { TabsItem, Headline } from '@vkontakte/vkui';

import { useState, useMemo, useImmutableCallback } from '../../../hooks/base';

const TIME = [60, 90, 120, 150, 180];
const POINT = [25, 50, 75, 100, 150];

const AliasSettings = ({ id, goBack, goForward }) => {
  const openTeams = useImmutableCallback(() => {
    goForward('teams');
  });

  const [time, setTime] = useState(TIME[0]);
  const [point, setPoint] = useState(POINT[0]);

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

  return (
    <GradientPanel
      id={id}
      onClose={goBack}
      title="Настройки"
      color="yellow"
    >
      <Headline weight="semibold">
        Длительность раунда
      </Headline>
      <Tabs>
        {timeTabs}
      </Tabs>

      <Headline weight="semibold">
        Очков для победы
      </Headline>
      <Tabs>
        {pointTabs}
      </Tabs>

      <Checkbox>Каждое пропущенное слово отнимает очки</Checkbox>

      <button onClick={openTeams}>Далее</button>
    </GradientPanel>
  );
};

AliasSettings.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasSettings;

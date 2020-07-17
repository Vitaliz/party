import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import RichPanel from '../components/panel/RichPanel';
import HorizontalScroll from '../components/common/HorizontalScroll';
import Card from '../components/Card';
import Subscribe from '../components/Subscribe';

import { useImmutableCallback } from '../hooks/base';

import { SETTINGS } from '../utils/constants';

const MainTitle = styled.h1`
  font-size: 26px;
  line-height: 32px;
  letter-spacing: 0.01em;

  color: #fff;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  margin: 0;
`;

const MainHorizontalScroll = styled(HorizontalScroll)`
  margin: 0 -16px;
  padding: 0 16px;
`;

const MainSubscribe = styled(Subscribe)`
  margin: auto 0;
`;

const Main = ({ id, goForward }) => {
  const openAlias = useImmutableCallback(() => {
    goForward('alias');
  });

  const openStickers = useImmutableCallback(() => {
    goForward('stickers');
  });

  const openCroco = useImmutableCallback(() => {
    // callback('croco');
  });

  const openMafia = useImmutableCallback(() => {
    // callback('mafia');
  });

  return (
    <RichPanel
      id={id}
      title="partygame"
      affix={<MainTitle>Во что сыграем?</MainTitle>}
      postfix={<MainSubscribe />}
    >
      <MainHorizontalScroll>
        <Card
          color="yellow"
          name="Алиас"
          description="Объясняй слова!"
          count={SETTINGS.alias.count}
          time={SETTINGS.alias.time}
          callback={openAlias}
        />
        <Card
          color="blue"
          name="Стикерочки"
          description="Угадай, кто ты!"
          count={SETTINGS.stickers.count}
          time={SETTINGS.stickers.time}
          callback={openStickers}
        />
        <Card
          color="green"
          name="Крокодил"
          description="Показывай без слов!"
          count={SETTINGS.croco.count}
          time={SETTINGS.croco.time}
          callback={openCroco}
        />
        <Card
          color="gray"
          name="Мафия"
          description="Очисти город от мафии!"
          count={SETTINGS.mafia.count}
          time={SETTINGS.mafia.time}
          callback={openMafia}
        />
      </MainHorizontalScroll>
    </RichPanel>
  );
};

Main.propTypes = {
  id: PropTypes.string.isRequired,
  goForward: PropTypes.func.isRequired
};

export default Main;

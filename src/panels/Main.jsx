import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import RichPanel from '../components/panel/RichPanel';
import HorizontalScroll from '../components/common/HorizontalScroll';
import Card from '../components/Card';
import Subscribe from '../components/Subscribe';
import QrScanner from '../components/QrScanner';

import { useImmutableCallback } from '../hooks/base';
import { useBridge } from '../hooks/util';

import { SETTINGS, APP_GROUP } from '../utils/constants';

const MainTitle = styled.h1`
  font-size: 26px;
  line-height: 32px;
  letter-spacing: 0.01em;

  color: #fff;
  text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  margin: 0;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const MainHorizontalScroll = styled(HorizontalScroll)`
  &.HorizontalScroll--android {
    margin: 0 -16px;
    padding: 0 16px;
  }

  &.HorizontalScroll--ios {
    margin: 0 -12px;
    padding: 0 12px;
  }
`;

const MainSubscribe = styled(Subscribe)`
  margin: auto 0;
`;

const Main = ({ id, goForward }) => {
  const bridge = useBridge();

  const openStickers = useImmutableCallback(() => {
    goForward('stickers');
  });

  const openAlias = useImmutableCallback(() => {
    goForward('alias');
  });

  // const openCroco = useImmutableCallback(() => {
  //   goForward('croco');
  // });

  // const openMafia = useImmutableCallback(() => {
  //   goForward('mafia');
  // });

  const subscribeNotifications = useImmutableCallback(() => {
    if (bridge.supports('VKWebAppAllowNotifications')) {
      bridge.send('VKWebAppAllowNotifications').catch(() => {
        // ignore
      });
      return;
    }

    if (bridge.supports('VKWebAppAllowMessagesFromGroup')) {
      bridge.send('VKWebAppAllowMessagesFromGroup', {
        group_id: APP_GROUP,
        key: 'vma'
      }).catch(() => {
        // ignore
      });
      return;
    }
  });

  return (
    <RichPanel
      id={id}
      title="Party Games"
      affix={(
        <MainTitle>
          <span>Во что сыграем?</span>
          <QrScanner />
        </MainTitle>
      )}
      postfix={<MainSubscribe />}
    >
      <MainHorizontalScroll>
        <Card
          color="blue"
          name="Стикерочки"
          description="Угадай, кто ты!"
          count={SETTINGS.stickers.count}
          time={SETTINGS.stickers.time}
          action="Играть"
          callback={openStickers}
        />
        <Card
          color="yellow"
          name="Алиас"
          description="Объясняй слова!"
          count={SETTINGS.alias.count}
          time={SETTINGS.alias.time}
          action="Играть"
          callback={openAlias}
        />
        {/* <Card
          color="green"
          name="Крокодил"
          description="Показывай без слов!"
          count={SETTINGS.croco.count}
          time={SETTINGS.croco.time}
          action="Играть"
          callback={openCroco}
        />
        <Card
          color="gray"
          name="Мафия"
          description="Очисти город от мафии!"
          count={SETTINGS.mafia.count}
          time={SETTINGS.mafia.time}
          action="Играть"
          callback={openMafia}
        /> */}
        <Card
          color="pink"
          name="Скоро"
          description="Подпишись и получай уведомления о выходе новых игр первым."
          action="Подписаться"
          callback={subscribeNotifications}
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

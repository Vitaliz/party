import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import RichPanel from '../components/panel/RichPanel';
import HorizontalScroll from '../components/common/HorizontalScroll';
import Card from '../components/Card';
import Subscribe from '../components/Subscribe';

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

const Main = ({ id }) => {
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
          name="Алиасы"
          description="Объясняй слова!"
          count="4+"
          time="15 мин"
        />
        <Card
          color="blue"
          name="Стикеры"
          description="Угадай, кто ты!"
          count="2+"
          time="10 мин"
        />
        <Card
          color="green"
          name="Крокодил"
          description="Показывай без слов!"
          count="2+"
          time="10 мин"
        />
        <Card
          color="gray"
          name="Мафия"
          description="Очисти город от мафии!"
          count="4+"
          time="15 мин"
        />
      </MainHorizontalScroll>
    </RichPanel>
  );
};

Main.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default Main;

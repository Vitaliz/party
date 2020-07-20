import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Swipeable, direction } from 'react-deck-swiper';
import { useState, useMemo, useEffect } from '../../../hooks/base';

import { Div, platform, ANDROID } from '@vkontakte/vkui';

const AndroidBorder = css`
  border-radius: 8px;
`;

const iOSBorder = css`
  border-radius: 10px;
`;

const CardBorder = platform() === ANDROID ?
  AndroidBorder : iOSBorder;

const Card = styled(Div)`
  ${CardBorder}

  color: #FFA54F;
  background-color: #fff;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;

  width: 288px;
  height: 288px;

  margin: 0 auto;

  line-height: 32px;
  font-size: 26px;
  font-weight: 700;
`;

const Cards = ({ cards, onDismiss, onAccept, onDone }) => {
  const [current, setCurrent] = useState(0);

  const onSwipe = (dir) => {
    const payload = cards[current];

    if (dir === direction.LEFT) {
      onDismiss(payload);
      setCurrent((current) => current + 1);
      return;
    }

    if (dir === direction.RIGHT) {
      onAccept(payload);
      setCurrent((current) => current + 1);
      return;
    }
  };

  const card = useMemo(() => {
    if (cards && current >= 0 && current < cards.length) {
      return (
        <Card key={current}>
          {cards[current]}
        </Card>
      );
    }
    return null;
  }, [cards, current]);

  useEffect(() => {
    if (cards && cards.length > 0 && current >= cards.length) {
      setCurrent(0);
      onDone();
    }
  }, [cards, current, onDone]);

  return (
    <Swipeable onSwipe={onSwipe}>
      {card}
    </Swipeable>
  );
};

Cards.propTypes = {
  cards: PropTypes.array,
  onAccept: PropTypes.func,
  onDismiss: PropTypes.func,
  onDone: PropTypes.func
};

export default Cards;

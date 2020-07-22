import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Card, CardsContainer } from '../../../components/tinder/index';
import { useState, useCompute, useRef, useEffect, useMemo } from '../../../hooks/base';

import ThemedButton from '../../../components/common/ThemedButton';
import Row from '../../../components/common/Row';
import { platform, ANDROID, FixedLayout } from '@vkontakte/vkui';

const AndroidBorder = css`
  border-radius: 8px;
`;

const iOSBorder = css`
  border-radius: 10px;
`;

const CardBorder = platform() === ANDROID ?
  AndroidBorder : iOSBorder;

const UnifiedCardsContainer = styled(CardsContainer)`
  position: fixed;
  z-index: 10;

  width: 100%;
  height: 288px;

  left: 0;
  bottom: 2in;

  @media (min-height: 700px) {
    bottom: 3.4in;
  }

  transform: translate3d(0, 0, 0);
  will-change: transform;
  backface-visibility: hidden;
`;

const UnifiedCard = styled(Card)`
  ${CardBorder}

  cursor: grab;
  pointer-events: all;

  color: #FFA54F;
  background-color: #fff;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;

  position: absolute;
  overflow: hidden;

  width: 288px;
  height: 288px;

  border: 1px solid #e6e6e6;
  box-sizing: border-box;

  line-height: 32px;
  font-size: 26px;
  font-weight: 700;

  opacity: 1;
  transition: opacity .3s ease-out;
  will-change: transform;
  backface-visibility: hidden;

  &.animate {
    transition: transform .3s ease-out, opacity .3s ease-out;
  }

  &.hide {
    opacity: 0.2;
  }
`;

const CardsLayout = styled(FixedLayout).attrs(() => ({
  vertical: 'bottom'
}))`
  @media (min-height: 700px) {
    bottom: 1.4in;
  }
`;

const NoopRemove = () => null;

const Cards = ({ cards, onDismiss, onAccept, onDone }) => {
  const removeCard = useRef(NoopRemove);

  const start = useMemo(() => {
    return cards.slice(0, 2);
  }, [cards]);

  const noopCards = useRef(start);
  const [current, setCurrent] = useState(start.length);

  useEffect(() => {
    noopCards.current = start;
    setCurrent(start.length);
  }, [start]);

  useEffect(() => {
    if (current >= cards.length) {
      setCurrent(0);
      return;
    }

    noopCards.current.push(cards[current]);
  }, [current]);

  const onLeft = () => {
    const payload = cards[current];

    onDismiss(payload);
    setCurrent((current) => current + 1);
  };

  const onButtonLeft = () => {
    removeCard.current();
    onLeft();
  };

  const onRight = () => {
    const payload = cards[current];

    onAccept(payload);
    setCurrent((current) => current + 1);
  };

  const onButtonRight = () => {
    removeCard.current();
    onRight();
  };

  const renderCards = useCompute(() => {
    return noopCards.current.map((card) => (
      <UnifiedCard
        key={card}
        className="card"
        onSwipeLeft={onLeft}
        onSwipeRight={onRight}
      >
        {card}
      </UnifiedCard>
    ));
  });

  const onProvideRemove = (remover) => {
    removeCard.current = remover;
  };

  return (
    <div className="master-root">
      <UnifiedCardsContainer
        onEnd={onDone}
        onProvideRemove={onProvideRemove}
      >
        {renderCards}
      </UnifiedCardsContainer>
      <CardsLayout>
        <Row>
          <ThemedButton
            $color="yellow"
            $overlay={true}
            stretched={true}
            onClick={onButtonLeft}
          >
            Пропуск
          </ThemedButton>
          <ThemedButton
            $color="yellow"
            $overlay={true}
            stretched={true}
            onClick={onButtonRight}
          >
            Далее
          </ThemedButton>
        </Row>
      </CardsLayout>
    </div>
  );
};

Cards.propTypes = {
  cards: PropTypes.array,
  onAccept: PropTypes.func,
  onDismiss: PropTypes.func,
  onDone: PropTypes.func
};

export default Cards;

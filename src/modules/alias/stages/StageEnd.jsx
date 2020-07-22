import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import ThemedButton from '../../../components/common/ThemedButton';
import { FixedLayout, Div } from '@vkontakte/vkui';
import AliasAffix from '../components/AliasAffix';
import AliasAnswer from '../components/AliasAnswer';
import TeamAffix from '../components/TeamAffix';
import Counter from '../../../components/Counter';
import MirrorHill from '../../../components/MirrorHill';

import { useState, useCompute } from '../../../hooks/base';

import Core from '../core';

const AnswersContainer = styled.div`
  padding-bottom: 56px;
  padding-bottom: calc(56px + var(--safe-area-inset-bottom, 0px));
`;

/**
 * Stage end
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const StageEnd = ({ game }) => {
  const [isClicked, setClickedState] = useState(false);

  const answers = useCompute(() => {
    return game.answers.map((answer) => {
      return (
        <AliasAnswer
          key={answer.name}
          success={answer.success}
        >
          {answer.name}
        </AliasAnswer>
      );
    });
  });

  const points = useCompute(() => {
    const points = game.answers.reduce((acc, answer) => {
      if (answer.success) {
        ++acc;
      } else {
        if (game.settings.away) {
          --acc;
        }
      }
      return acc;
    }, 0);

    return points < 0 ? 0 : points;
  });

  const team = useCompute(() => {
    const name = game.current.item.team;

    let renderPoints = null;
    if (points > 0) {
      renderPoints = `+${points}`;
    } else {
      renderPoints = '0';
    }

    return (
      <TeamAffix key={name}>
        <span>{name}</span>
        <Counter $color="yellow">{renderPoints}</Counter>
      </TeamAffix>
    );
  });

  const endGame = () => {
    setClickedState(true);
    game.end(points);
  };

  return (
    <>
      <AliasAffix>
        <span>Результаты раунда</span>
      </AliasAffix>
      <MirrorHill>
        {team}
      </MirrorHill>
      <AnswersContainer>
        {answers}
      </AnswersContainer>
      <FixedLayout
        vertical="bottom"
      >
        <Div>
          <ThemedButton
            $color="yellow"
            $overlay={true}
            disabled={isClicked}
            onClick={endGame}
          >
            Закончить
          </ThemedButton>
        </Div>
      </FixedLayout>
    </>
  );
};

StageEnd.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
};

export default StageEnd;

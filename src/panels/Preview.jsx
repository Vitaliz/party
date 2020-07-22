import StageDefault from '../modules/alias/stages/StageDefault';
import StageStart from '../modules/alias/stages/StageStart';
import StageGame from '../modules/alias/stages/StageGame';
import StageEnd from '../modules/alias/stages/StageEnd';
import StageResult from '../modules/alias/stages/StageResult';
import StageViewer from '../modules/alias/stages/StageViewer';
import StageMember from '../modules/alias/stages/StageMember';

const GAME_MOCK = {
  stage: STAGE.GAME,
  answers: [
    {
      success: true,
      name: 'Test check'
    },
    {
      success: false,
      name: 'Checl yw'
    },
    {
      success: false,
      name: 'Checl yww'
    },
    {
      success: true,
      name: 'Checl yppaw'
    },
    {
      success: true,
      name: 'Checl yasw'
    },
    {
      success: true,
      name: 'Checl yasppaw'
    },
    {
      success: true,
      name: 'Checsdsl yasw'
    },
    {
      success: true,
      name: 'Chesdsacl yasw'
    },
    {
      success: false,
      name: 'Chegsdcl yasw'
    },
    {
      success: true,
      name: 'Chasdecl yasw'
    },
    {
      success: true,
      name: 'Chwaecl yasw'
    },
    {
      success: true,
      name: 'Chwae121cl yasw'
    },
    {
      success: true,
      name: 'Chw3123aecl yasw'
    },
    {
      success: true,
      name: 'Chwae142cl yasw'
    },
    {
      success: true,
      name: 'Chw132aecl yasw'
    }
  ],
  current: {
    item: {
      peer: 1,
      team: 'Ma long duck'
    },
    lap: 7
  },
  settings: {
    away: false,
    point: 277,
    time: 0,
    teams: [
      {
        name: 'Ma long duck',
        users: [{
          vkUserId: 1
        }],
        peers: [1],
        points: 10
      },
      {
        name: 'Ma small acc',
        users: [{
          vkUserId: 2
        }],
        peers: [2],
        points: 10000
      },
      {
        name: 'Ma large acc',
        users: [{
          vkUserId: 3
        }],
        peers: [3],
        points: 120
      },
      {
        name: 'Ma short duck',
        users: [{
          vkUserId: 4
        }],
        peers: [4],
        points: 99
      }
    ]
  }
};

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { transitionEvent } from '@vkontakte/vkui/dist/lib/supportEvents';
import { platform, ANDROID } from '@vkontakte/vkui';
import GradientPanel from '../components/panel/GradientPanel';

import { useMemo } from '../hooks/base';

import Core, { STAGE } from '../modules/alias/core';

const AndroidTransition = css`
  transition: opacity 300ms cubic-bezier(.4, 0, .2, 1);
  transition: opacity 300ms var(--android-easing);
`;

const iOSTransition = css`
  transition: opacity 300ms cubic-bezier(.36, .66, .04, 1);
  transition: opacity 300ms var(--ios-easing);
`;

const ViewContainerTransition = platform() === ANDROID ?
  AndroidTransition : iOSTransition;

const ViewContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;

  &.switch-enter,
  &.switch-exit-active,
  &.switch-exit-done {
    opacity: 0;
  }

  &.switch-enter-active,
  &.switch-enter-done,
  &.switch-exit {
    opacity: 1;
  }

  &.switch-appear-active,
  &.switch-enter-active,
  &.switch-exit-active {
    ${ViewContainerTransition}
  }
`;

/**
 * Play screen
 *
 * @param {Object} props
 * @param {Core} props.game
 */
const Preview = ({ game = GAME_MOCK, id = 'preview' }) => {
  const view = useMemo(() => {
    switch (game.stage) {
      case STAGE.START:
        return (
          <StageStart game={game} />
        );
      case STAGE.GAME:
        return (
          <StageGame game={game} />
        );
      case STAGE.END:
        return (
          <StageEnd game={game} />
        );
      case STAGE.RESULT:
        return (
          <StageResult game={game} />
        );
      case STAGE.VIEWER:
        return (
          <StageViewer game={game} />
        );
      case STAGE.MEMBER:
        return (
          <StageMember game={game} />
        );
      default:
        return (
          <StageDefault />
        );
    }
  }, [game.stage]);

  const title = useMemo(() => {
    switch (game.stage) {
      case STAGE.START:
        return 'Подготовка';
      case STAGE.GAME:
        return 'Игра';
      case STAGE.END:
        return 'Подсчет';
      case STAGE.RESULT:
        return 'Результаты';
      case STAGE.VIEWER:
        return 'Зритель';
      case STAGE.MEMBER:
        return 'Участник';
      default:
        return 'Ожидание';
    }
  }, [game.stage]);

  return (
    <GradientPanel
      id={id}
      color="yellow"
      title={title}
    >
      <SwitchTransition
        mode="out-in"
        key={game.stage}
      >
        <CSSTransition
          key={game.stage}
          addEndListener={(node, done) => {
            if (transitionEvent.supported) {
              node.addEventListener(transitionEvent.name, done, false);
            } else {
              setTimeout(done, 300);
            }
          }}
          classNames="switch"
        >
          <ViewContainer>
            {view}
          </ViewContainer>
        </CSSTransition>
      </SwitchTransition>
    </GradientPanel>
  );
};

Preview.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default Preview;

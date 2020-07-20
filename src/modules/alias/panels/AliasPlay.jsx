import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { transitionEvent } from '@vkontakte/vkui/dist/lib/supportEvents';
import { platform, ANDROID } from '@vkontakte/vkui';
import GradientPanel from '../../../components/panel/GradientPanel';

import StageDefault from '../stages/StageDefault';
import StageStart from '../stages/StageStart';
import StageGame from '../stages/StageGame';
import StageEnd from '../stages/StageEnd';
import StageResult from '../stages/StageResult';
import StageViewer from '../stages/StageViewer';
import StageMember from '../stages/StageMember';

import { useMount, useUnmount, useForceUpdate, useMemo } from '../../../hooks/base';
import { useClearOverlay } from '../../../hooks/overlay';

import Core, { STAGE } from '../core';

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
const AliasPlay = ({ game, id }) => {
  const clearOverlay = useClearOverlay();
  useMount(() => {
    clearOverlay(() => {
      // TODO
    });
  });

  const update = useForceUpdate();
  useMount(() => {
    game.attach(update);
  });
  useUnmount(() => {
    game.detach(update);
  });

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
        return 'Начало';
      case STAGE.GAME:
        return 'Игра';
      case STAGE.END:
        return 'Конец';
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

AliasPlay.propTypes = {
  game: PropTypes.instanceOf(Core).isRequired,
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasPlay;

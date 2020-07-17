import React from 'react';
import PropTypes from 'prop-types';

import AliasView from '../components/AliasView';
import AliasPlay from '../panels/AliasPlay';
import AliasJoin from '../panels/AliasJoin';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import { useImmutableCallback, useState, useUnmount, useDeepMemo } from '../../../hooks/base';
import { useBus } from '../../../hooks/util';
import { useStore } from '../../../hooks/store';

import Core from '../core';
import singleton from '../../../utils/singleton';

const AliasGame = ({ id }) => {
  const bus = useBus();
  const store = useStore();

  const [panel, setPanel] = useState('join');

  const game = useDeepMemo(() => {
    return singleton.getInstance(Core, store.user, store.game);
  }, []);

  useUnmount(() => {
    if (game) {
      game.destroy();
    }
    singleton.destroyInstance(Core);
  });

  const toPlay = useImmutableCallback(() => {
    setPanel('play');
  });

  const toJoin = useImmutableCallback(() => {
    setPanel('join');
  });

  const toHome = useImmutableCallback(() => {
    bus.emit('app:view', 'home');
  });

  const toSettings = useImmutableCallback(() => {
    bus.emit('app:view', 'alias-prepare');
  });

  return (
    <AliasView
      id={id}
      activePanel={panel}
      modal={<ModalProvider />}
      popout={<PopoutProvider />}
      header={false}
    >
      <AliasJoin
        game={game}
        id="join"
        goBack={toSettings}
        goForward={toPlay}
      />
      <AliasPlay
        game={game}
        id="play"
        goBack={toJoin}
        goForward={toHome}
      />
    </AliasView>
  );
};

AliasGame.propTypes = {
  id: PropTypes.string.isRequired
};

export default AliasGame;

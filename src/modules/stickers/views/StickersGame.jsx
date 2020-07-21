import React from 'react';
import PropTypes from 'prop-types';

import StickersView from '../components/StickersView';

import StickersLobby from '../panels/StickersLobby';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import {useImmutableCallback, useEffect, useState} from '../../../hooks/base';
import {useBridge, useBus} from '../../../hooks/util';
import {baseParams} from '../../../utils/uri';

import io from 'socket.io-client';
import {useStore} from '../../../hooks/store';
import StickersPrepare from '../panels/StickersPrepare';
import StickersMain from '../panels/StickersMain';
import {URL_WS} from '../../../utils/constants';

const socket = io(URL_WS + '?vk-params=' + encodeURIComponent(baseParams(window.location.search)), {
  transports: ['websocket']
});

const StickersGame = ({id}) => {
  const store = useStore();
  const bridge = useBridge();

  let gameId = store.game.id ?? null;

  const [panel, setPanel] = useState('lobby');
  const bus = useBus();
  const [game, setGame] = useState(null);

  const startTyping = () => {
    socket.emit('start-game-prepare', game.id);
  };

  const setWord = (word) => {
    socket.emit('set-word', JSON.stringify({
      gameId: game.id,
      word: word
    }));
    setPanel('main');
  };

  const gotWord = () => {
    socket.emit('got-word', game.id);
  };

  const restartGame = () => {
    socket.emit('restart-game', game.id);
  };

  useEffect(() => {

    if (game) {
      const bridgeListener = (event) => {
        if (event.detail.type === 'VKWebAppViewRestore') {
          socket.emit('join-game', game.id);
        }
      };

      bridge.subscribe(bridgeListener);

      return () => {
        bridge.unsubscribe(bridgeListener);
      };
    }
  }, [game]);

  useEffect(() => {
    if (!gameId) {
      socket.emit('create-game');
    } else {
      socket.emit('join-game', gameId);
      gameId = null;
      store.game.id = null;
    }

    socket.on('game-created', (msg) => {
      const {data} = msg;
      setGame(data);
    });

    socket.on('game-updated', (msg) => {
      const {data} = msg;
      setGame(data);
    });

    socket.on('game-prepared', (msg) => {
      const {data} = msg;
      setGame(data);
      setPanel('prepare');
    });

    socket.on('game-restarted', (msg) => {
      const {data} = msg;
      setGame(data);
      setPanel('prepare');
    });

    socket.on('word-set', (msg) => {
      const {data} = msg;
      setGame(data);
    });
  }, []);

  const close = useImmutableCallback(() => {
    setGame(null);
    bus.emit('app:view', 'home');
  });

  const start = useImmutableCallback(() => {
    bus.emit('app:view', 'stickers-game');
  });

  return (
    <StickersView
      id={id}
      activePanel={panel}
      modal={<ModalProvider/>}
      popout={<PopoutProvider/>}
      header={false}
    >
      <StickersLobby game={game} close={close} id="lobby" goForward={start}
        start={startTyping}/>
      <StickersPrepare id="prepare" game={game} start={setWord}/>
      <StickersMain close={close} id="main" game={game} wordGot={gotWord} restartGame={restartGame}/>
    </StickersView>
  );
};

StickersGame.propTypes = {
  id: PropTypes.string.isRequired
};

export default StickersGame;

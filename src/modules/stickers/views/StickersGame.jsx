import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import StickersView from '../components/StickersView';

import StickersLobby from '../panels/StickersLobby';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import {useHistory} from '../../../hooks/router';
import {useImmutableCallback} from '../../../hooks/base';
import {/*useBridge,*/ useBus} from '../../../hooks/util';
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
  // const bridge = useBridge();

  let gameId = store.game.id ?? null;

  console.log('gd', Boolean(gameId));

  const panels = useHistory('lobby');
  const bus = useBus();
  const [game, setGame] = useState(null);

  const startTyping = () => {
    console.log('start', game.id);
    socket.emit('start-game-prepare', game.id);
  };

  const setWord = (word) => {
    console.log('set word', word);
    socket.emit('set-word', JSON.stringify({
      gameId: game.id,
      word: word
    }));
    panels.setActivePanel('main');
  };

  const gotWord = () => {
    console.log('word got');
    socket.emit('got-word', game.id);
  };

  const restartGame = () => {
    console.log('word got');
    socket.emit('restart-game', game.id);
  };

  // useEffect(() => {
  //   const bridgeListener = (event) => {
  //     console.log('EVENT', event.detail.type);
  //     if (event.detail.type === 'VKWebAppViewRestore' && game) {
  //       console.log('emit');
  //       socket.emit('join-game', game.id);
  //     }
  //   };

  //   bridge.subscribe(bridgeListener);

  //   return () => {
  //     bridge.unsubscribe(bridgeListener);
  //   };
  // }, [game]);

  useEffect(() => {

    console.log('on connect');
    if (!gameId) {
      console.log('create');
      socket.emit('create-game');
    } else {
      console.log('join');
      socket.emit('join-game', gameId);
      gameId = null;
      store.game.id = null;
    }


    socket.on('game-created', (msg) => {
      const {data} = msg;
      console.log('game created', data);

      setGame(data);
    });

    socket.on('game-updated', (msg) => {
      const {data} = msg;
      console.log('game updated', data);

      setGame(data);
    });

    socket.on('game-prepared', (msg) => {
      const {data} = msg;
      console.log('game prepared', data);

      setGame(data);

      panels.setActivePanel('prepare');
    });

    socket.on('game-restarted', (msg) => {
      const {data} = msg;
      console.log('game restarted', data);

      setGame(data);

      panels.setActivePanel('prepare');
    });

    socket.on('word-set', (msg) => {
      const {data} = msg;
      console.log('word set', data);

      setGame(data);
    });
  }, []);

  const close = useImmutableCallback(() => {
    bus.emit('app:view', 'home');
  });

  const start = useImmutableCallback(() => {
    bus.emit('app:view', 'stickers-game');
  });

  return (
    <StickersView
      id={id}
      activePanel={panels.activePanel}
      history={panels.history}
      onSwipeBack={panels.goBack}
      modal={<ModalProvider/>}
      popout={<PopoutProvider/>}
      header={false}
    >
      <StickersLobby game={game} close={close} id="lobby" goForward={start}
        start={startTyping}/>
      <StickersPrepare id="prepare" game={game} goBack={panels.goBack} start={setWord}/>
      <StickersMain close={close} id="main" game={game} wordGot={gotWord} restartGame={restartGame}/>
    </StickersView>
  );
};

StickersGame.propTypes = {
  id: PropTypes.string.isRequired
};

export default StickersGame;

import React from 'react';

import { Root } from '@vkontakte/vkui';

import Home from '../views/Home';

import AliasGame from '../modules/alias/views/AliasGame';
import AliasPrepare from '../modules/alias/views/AliasPrepare';

import { useState, useMount } from '../hooks/base';
import { useBus, useBridge } from '../hooks/util';
import { useStore } from '../hooks/store';

const App = () => {
  const bus = useBus();
  const bridge = useBridge();
  const store = useStore();

  const [view, setView] = useState('home');

  useMount(() => {
    bus.on('app:view', (view) => {
      setView(view);
    });

    bus.on('app:code', (code) => {
      const params = code.split('-');
      const isHasSalt = params[3];
      const isNotExpired = (Date.now() - +params[2]) < 4E6;
      if (isHasSalt && isNotExpired) {
        store.game.creator = +params[1];
        setView(`${params[0]}-game`);
      }
    });
  });

  useMount(() => {
    const test = /([a-z]+-[0-9]+-[0-9]+-\w+)/i;
    const checkCodeOrFetch = (location, shouldShowError) => {
      // uuid v4
      const hash = test.exec(location);
      if (hash && hash[1]) {
        if (bridge.supports('VKWebAppSetLocation')) {
          bridge.send('VKWebAppSetLocation', {
            location: ''
          }).catch(() => {
            window.location.hash = '';
          });
        } else {
          window.location.hash = '';
        }

        const code = () => {
          bus.emit('app:code', hash[1]);
        };

        if (store.user.vkUserId) {
          code();
        } else {
          bus.once('app:auth', code);
        }
      } else {
        if (shouldShowError) {
          if (store.user.vkUserId) {
            bus.emit('app:error');
          } else {
            bus.once('app:auth', () => {
              bus.emit('app:error');
            });
          }
        }
        bus.emit('app:update');
      }
    };

    bridge.subscribe((event) => {
      if (!event || !event.detail) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppLocationChanged':
          checkCodeOrFetch(event.detail.data.location, false);
          break;
        case 'VKWebAppViewRestore':
          checkCodeOrFetch(window.location.hash, false);
          break;
        case 'VKWebAppOpenQRResult':
        case 'VKWebAppOpenCodeReaderResult':
          checkCodeOrFetch(event.detail.data.qr_data || event.detail.data.code_data, true);
          break;
      }
    });

    checkCodeOrFetch(window.location.hash);
  });

  return (
    <Root activeView={view}>
      <Home id="home" />
      <AliasPrepare id="alias-prepare" />
      <AliasGame id="alias-game" />
    </Root>
  );
};

export default App;

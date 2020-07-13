import React from 'react';

import { ConfigProvider, Root } from '@vkontakte/vkui';

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
    const test = /join-([0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
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

        if (store.user.id) {
          code();
        } else {
          bus.once('app:auth', code);
        }
      } else {
        if (shouldShowError) {
          bus.once('app:auth', () => {
            bus.emit('code:error');
          });
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

  useMount(() => {
    bus.on('app:view', (view) => {
      setView(view);
    });
  });

  return (
    <ConfigProvider>
      <Root activeView={view}>
        <Home id="home" />
        <AliasPrepare id="alias-prepare" />
        <AliasGame id="alias-game" />
      </Root>
    </ConfigProvider>
  );
};

export default App;

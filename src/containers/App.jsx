import React from 'react';


import {Root} from '@vkontakte/vkui';

import Home from '../views/Home';

import AliasGame from '../modules/alias/views/AliasGame';
import AliasPrepare from '../modules/alias/views/AliasPrepare';

import StickersGame from '../modules/stickers/views/StickersGame';

import {useMount, useState} from '../hooks/base';
import {useBridge, useBus} from '../hooks/util';
import {useStore} from '../hooks/store';

const App = () => {
  const bus = useBus();
  const bridge = useBridge();
  const store = useStore();

  const [view, setView] = useState('home');

  useMount(() => {
    bus.on('app:view', (view) => {
      setView(view);
    });

    bus.on('app:code', (params) => {
      // const params = code.split('-');
      const isHasSalt = params[3];
      const isNotExpired = (Date.now() - +params[2]) < 4E6;
      if (isHasSalt && isNotExpired) {
        store.game.creator = +params[1];
        store.game.id = params[1];
        setView(`${params[0]}-game`);
      }
    });
  });

  useMount(() => {
    const test = /([a-z]+-[0-9]+-[0-9]+-\w+)/i;
    const testUuidV4 = /([a-z]+)-([0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})-(\w+)-(\w+)/i;
    const checkCodeOrFetch = (location, shouldShowError) => {
      // old
      const hash = test.exec(location);

      // uuid v4
      const hashV4 = testUuidV4.exec(location);

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

          const params = hash[1].split('-');

          bus.emit('app:code', params);
        };

        if (store.user.vkUserId) {
          code();
        } else {
          bus.once('app:auth', code);
        }
      } else if (hashV4) {
        if (bridge.supports('VKWebAppSetLocation')) {
          window.location.hash = '';
          bridge.send('VKWebAppSetLocation', {
            location: ''
          }).catch(() => {
            window.location.hash = '';
          });
        } else {
          window.location.hash = '';
        }

        const params = [
          hashV4[1],
          hashV4[2],
          hashV4[3],
          hashV4[4],
        ];

        const code = () => {
          bus.emit('app:code', params);
        };

        if (store.user.vkUserId) {
          code();
        } else {
          bus.once('app:auth', code);
        }
      } else {
        if (shouldShowError) {
          if (store.user.vkUserId) {
            bus.emit('app:error', 'code');
          } else {
            bus.once('app:auth', () => {
              bus.emit('app:error', 'code');
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
      <Home id="home"/>
      <AliasPrepare id="alias-prepare"/>
      <AliasGame id="alias-game"/>

      <StickersGame id="stickers-game"/>
    </Root>
  );
};

export default App;

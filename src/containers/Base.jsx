import React from 'react';

import App from './App';
import Offline from '../components/common/Offline';

import CommonError from '../components/error/CommonError';

import sendError from '../utils/error';
import { interpretResponse } from '../utils/data';
import { VIEW_SETTINGS_BASE, VIEW_SETTINGS_EXTENDED } from '../utils/constants';

import { useState, useEffect, useMount } from '../hooks/base';
import { useRouter } from '../hooks/router';
import { useBridge, useBus } from '../hooks/util';
import { useModal } from '../hooks/overlay';
import { useStorage, useStore } from '../hooks/store';
import { useFetch } from '../hooks/fetch';

const Base = () => {
  const router = useRouter();
  const bridge = useBridge();
  const modal = useModal();
  const bus = useBus();
  const storage = useStorage();
  const store = useStore();
  const fetch = useFetch();

  const [loaded, updateLoadState] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useMount(() => {
    const handleOnlineStatus = () => {
      window.requestAnimationFrame(() => {
        setShowOffline(!window.navigator.onLine);
      });
    };

    handleOnlineStatus();
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    bridge.subscribe((event) => {
      if (!event || !event.detail) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppViewRestore':
        case 'VKWebAppLocationChanged':
        case 'VKWebAppSetLocationResult':
        case 'VKWebAppSetViewSettingsResult':
          handleOnlineStatus();
          break;
      }
    });

    const handleError = (error, source, lineno, colno, raw) => {
      const send = () => {
        return sendError(error, raw, source).then((send) => {
          switch (send.type) {
            case 'bridge':
            case 'network':
              return false;
            default:
              modal.set(<CommonError />);
              return true;
          }
        }).catch((e) => {
          console.error(e);
          return false;
        });
      };

      const prepare = () => {
        return new Promise((resolve) => {
          switch (router.state) {
            case 'modal':
              bus.once('modal:closed', resolve);
              bus.emit('modal:close');
              return;
            case 'popout':
              bus.emit('popout:close');
              resolve();
              return;
            default:
              window.requestAnimationFrame(() => {
                setTimeout(() => {
                  window.requestAnimationFrame(() => {
                    resolve();
                  });
                }, 1200);
              });
              return;
          }
        });
      };

      send().then((result) => {
        if (result) {
          return prepare().then(() => {
            bus.once('modal:updated', () => {
              bus.emit('modal:open');
            });
            bus.emit('modal:update');
          });
        }
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('abort', handleError);
    window.addEventListener('unhandledrejection', handleError);
  });

  useMount(() => {
    const fetchUser = window.FAKE_FLAG ? () => {
      return fetch.post('/vk-user/auth').then((response) => {
        const user = interpretResponse(response);
        user.created = response.status === 200;

        store.user = {
          ...store.user,
          ...user
        };
        bus.emit('app:auth');
      });
    } : () => Promise.resolve();

    bus.on('app:update', fetchUser);

    const windowLoad = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        // event
        window.onload = resolve;

        // fallback
        setTimeout(resolve, 1E4); // 10s
      }
    });

    const fontLoad = 'fonts' in document &&
      new Promise((resolve) => {
        if (document.fonts.status === 'loaded') {
          resolve();
        } else {
        // event
          document.fonts.onloadingdone = resolve;
          document.fonts.onloadingerror = resolve;

          // promise
          let { ready } = document.fonts;
          if (typeof ready === 'function') {
            ready = ready(); // vendor/old specific
          }
          Promise.resolve(ready).then(() => {
            const { status = 'error' } = document.fonts;
            if (status === 'loaded' || status === 'error') {
              resolve();
            } else {
              setTimeout(resolve, 1E3); // 1s
            }
          });

          // fallback
          setTimeout(resolve, 1E4);  // 10s
        }
      });

    const storageLoad = storage.get().then((loaded) => {
      store.persist = {
        ...store.persist,
        ...loaded.persist
      };
    });

    const updateView = () => {
      if (bridge.supports('VKWebAppSetViewSettings')) {
        bridge.send('VKWebAppSetViewSettings', VIEW_SETTINGS_BASE).catch(() => {
          // See: https://github.com/VKCOM/vk-bridge/issues/103
        });
      }
    };

    bridge.subscribe((event) => {
      if (!event || !event.detail) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppViewRestore':
        case 'VKWebAppLocationChanged':
          updateView();
          break;
      }
    });

    Promise.all([
      fetchUser(),
      storageLoad,
      fontLoad,
      windowLoad
    ]).then(() => {
      updateLoadState(true);
    });
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        window.requestAnimationFrame(() => {
          // app seems ready

          // Plaform bug: flash WebView
          // Workaround: send before WebAppInit
          if (bridge.supports('VKWebAppSetViewSettings')) {
            bridge.send('VKWebAppSetViewSettings', VIEW_SETTINGS_EXTENDED).catch(() => {
              // See: https://github.com/VKCOM/vk-bridge/issues/103
            });
          }

          bridge.send('VKWebAppInit');
        });
      }, 600);
    }
  }, [loaded]);

  return (
    <React.StrictMode>
      {
        loaded ? (
          <App />
        ): (
          <div className="Root" />
        )
      }
      <Offline visible={showOffline} />
    </React.StrictMode>
  );
};

export default Base;

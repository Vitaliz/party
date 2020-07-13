import bridge from './bridge';

const fallbackInit = () => {
  return new Promise((resolve) => {
    bridge.send('VKWebAppInit').then(resolve);
    window.setTimeout(resolve, 1E3);
  });
};

export default function initView() {
  if (bridge.isWebView()) {
    const reduce = (fn) => {
      let isReduced = false;
      let isSaved = false;
      const wrapper = () => {
        if (isReduced) {
          isSaved = true;
          return;
        }
        fn();
        isReduced = true;
        window.setTimeout(() => {
          isReduced = false;
          if (isSaved) {
            wrapper();
            isSaved = false;
          }
        }, 100);
      };
      return wrapper;
    };

    const parsedAndroidVersion = /android\s([0-9]+)./i.exec(window.navigator.userAgent);
    let isAndroid = false;

    let statusbar = 0;
    let navigationbar = 0;

    if (parsedAndroidVersion && parsedAndroidVersion[1]) {
      const version = +parsedAndroidVersion[1];
      statusbar = version >= 6 ? 24 : 25;
      isAndroid = true;
    }

    const BASE_VIEW = {
      status_bar_style: 'light'
    };

    const ANDROID_VIEW = {
      ...BASE_VIEW,
      action_bar_color: '#fff',
      // Plaform bug: flash WebView and throw error
      // navigation_bar_color: '#fff'
    };

    const TRANSPARENT_ANDROID_VIEW = {
      ...BASE_VIEW,
      action_bar_color: 'none'
    };

    let currentView = isAndroid ? ANDROID_VIEW : BASE_VIEW;
    const updateView = () => {
      if (bridge.supports('VKWebAppSetViewSettings')) {
        return bridge.send('VKWebAppSetViewSettings', currentView).catch(() => {
          // See: https://github.com/VKCOM/vk-bridge/issues/103
        });
      }
      return Promise.resolve();
    };

    let defaultHeight = +window.innerHeight;
    let defaultWidth = +window.innerWidth;

    const polyfillInsets = reduce(() => {
      const currentWidth = +window.innerWidth;
      if (currentWidth !== defaultWidth) {
        return; // rotate or split screen
      }
      const currentHeight = +window.innerHeight;
      if (currentHeight !== defaultHeight) {
        navigationbar = currentHeight - defaultHeight - statusbar;
        if (navigationbar < 0) {
          navigationbar = 0;
        }
        window.dispatchEvent(new CustomEvent('VKWebAppEvent', {
          detail: {
            sideEffect: true, // mark as side effect
            type: 'VKWebAppUpdateInsets', // use old to avoid side effects
            data: {
              insets: {
                top: statusbar,
                bottom: navigationbar
              }
            }
          }
        }));
      }
    });
    window.addEventListener('resize', polyfillInsets);
    bridge.subscribe((event) => {
      if (!event || !event.detail || event.detail.sideEffect) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppUpdateConfig':
        case 'VKWebAppUpdateInsets':
          if (event.detail.data && event.detail.data.insets) {
            statusbar = event.detail.data.insets.top ?? statusbar;
            navigationbar = event.detail.data.insets.bottom ?? navigationbar;
            polyfillInsets();
          }
          break;
        case 'VKWebAppViewRestore':
        case 'VKWebAppLocationChanged':
          updateView();
          break;
      }
    });

    return fallbackInit().then(() => {
      defaultHeight = +window.innerHeight;
      defaultWidth = +window.innerWidth;

      return new Promise((resolve) => {
        if (isAndroid) {
          currentView = TRANSPARENT_ANDROID_VIEW;
          updateView().then(() => {
            window.requestAnimationFrame(() => {
              polyfillInsets();
              window.requestAnimationFrame(resolve);
            });
          });
        } else {
          resolve();
        }
      });
    });
  } else {
    return fallbackInit();
  }
}

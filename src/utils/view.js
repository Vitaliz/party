import bridge from './bridge';

const fallbackInit = () => {
  return new Promise((resolve) => {
    bridge.send('VKWebAppInit').then(resolve);
    window.setTimeout(resolve, 1E3);
  });
};

export function initView() {
  if (bridge.isWebView()) {
    const BASE_VIEW = {
      status_bar_style: 'dark',
      action_bar_color: '#fff'
    };

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
        }, 120);
      };
      return wrapper;
    };

    const updateView = reduce(() => {
      if (bridge.supports('VKWebAppSetViewSettings')) {
        return bridge.send('VKWebAppSetViewSettings', BASE_VIEW).catch(() => {
          // See: https://github.com/VKCOM/vk-bridge/issues/103
        });
      }
      return Promise.resolve();
    });

    bridge.subscribe((event) => {
      if (!event || !event.detail || event.detail.sideEffect) {
        return;
      }

      switch (event.detail.type) {
        case 'VKWebAppUpdateConfig':
        case 'VKWebAppUpdateInsets':
        case 'VKWebAppLocationChanged':
          updateView();
          break;
        case 'VKWebAppViewRestore':
        case 'VKWebAppOpenQRResult':
        case 'VKWebAppOpenQRFailed':
        case 'VKWebAppOpenCodeReaderResult':
        case 'VKWebAppOpenCodeReaderFailed':
          window.requestAnimationFrame(() => {
            window.setTimeout(() => {
              window.requestAnimationFrame(() => {
                updateView();
              });
            }, 230);
          });
          break;
      }
    });
  }

  return fallbackInit();
}

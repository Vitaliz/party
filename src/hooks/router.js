import { useState, useImmutableCallback, useMount, useUnmount } from './base';
import { useBus, useSwipe } from './util';

import globalBus from '../utils/bus';

const router = {
  state: null,
  push(name) {
    router.state = name;
    window.history.pushState(name, name);
  },
  replace(name) {
    router.state = name;
    window.history.replaceState(name, name);
  },
  back() {
    window.history.back();
  }
};

window.addEventListener('popstate', (e = window.event) => {
  const last = router.state;
  router.state = e.state;
  window.setTimeout(() => {
    globalBus.emit('router:popstate', last);
  }, 0);
});

function useRouter() {
  return router;
}

function useHistory(initialActivePanel) {
  const bus = useBus();
  const swipe = useSwipe();

  const [activePanel, setActivePanel] = useState(initialActivePanel);
  const [history, setHistory] = useState([initialActivePanel]);

  const followActivePanel = useImmutableCallback((nextActivePanel, needFlush) => {
    window.requestAnimationFrame(() => {
      setActivePanel(() => {
        if (needFlush || nextActivePanel === initialActivePanel) {
          swipe.disable();
        } else {
          swipe.enable();
        }

        return nextActivePanel ?? initialActivePanel;
      });
    });
  });

  const goForward = useImmutableCallback((nextPanel) => {
    followActivePanel(nextPanel);
    setHistory((history) => [...history, nextPanel]);
    router.push(nextPanel);
  });

  const back = useImmutableCallback(() => {
    setHistory((history) => {
      const nextHistory = history.slice(0, history.length - 1);

      if (history.length === 1) {
        followActivePanel(nextHistory[0], true);

        return history;
      }

      const nextPanel = nextHistory[nextHistory.length - 1];
      followActivePanel(nextPanel);

      return nextHistory;
    });
  });

  const followBack = useImmutableCallback((name) => {
    if (name === 'modal' || name === 'popout' || name === null) {
      return;
    }
    back();
  });

  useMount(() => {
    bus.on('router:popstate', followBack);
  });

  useUnmount(() => {
    bus.detach('router:popstate', followBack);
  });

  return {
    activePanel,
    setActivePanel: followActivePanel,
    history,
    setHistory,
    goForward,
    goBack: router.back
  };
}

export {
  useRouter,
  useHistory
};

import bridge from './bridge';
import bus from './bus';

export const SWIPE_EVENTS = ['dragstart', 'dragenter', 'gesturestart', 'gesturechange', 'MSGestureStart'];
export const AUX_EVENTS = ['auxclick', 'contextmenu'];
export const DEV_EVENTS = ['keydown'];

export const PARAM_PASSIVE = { passive: true };
export const PARAM_ACTIVE = { passive: false };

export const forcePrevent = (e = window.event) => {
  if (!e) {
    return;
  }

  if (e.cancelable) {
    if (e.preventDefault && !e.defaultPrevented) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  if (e.stopImmediatePropagation) {
    e.stopImmediatePropagation();
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  return false;
};

export const swipe = {
  state: false,
  enable() {
    this.state = true;

    if (bridge.supports('VKWebAppEnableSwipeBack')) {
      bridge.send('VKWebAppEnableSwipeBack');
    }

    SWIPE_EVENTS.forEach((event) => {
      document.removeEventListener(event, forcePrevent, PARAM_ACTIVE);
    });
  },
  disable() {
    this.state = false;

    if (bridge.supports('VKWebAppDisableSwipeBack')) {
      bridge.send('VKWebAppDisableSwipeBack');
    }

    SWIPE_EVENTS.forEach((event) => {
      document.addEventListener(event, forcePrevent, PARAM_ACTIVE);
    });
  }
};

export const resize = {
  _inited: false,
  _init() {
    if (this._inited) {
      return;
    }

    let ticking = false;
    const tick = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          bus.emit('resize');

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('resize', tick, PARAM_PASSIVE);
  },
  attach(fn) {
    bus.on('resize', fn);

    this._init();
    window.requestAnimationFrame(fn);

    return () => {
      bus.detach('resize', fn);
    };
  }
};

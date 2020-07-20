import globalBus from '../utils/bus';
import { useRouter } from './router';

const modal = {
  current: null,
  show(next) {
    globalBus.once('modal:updated', () => {
      globalBus.emit('modal:open');
    });
    modal.current = next;
    globalBus.emit('modal:update');
  }
};

function useModal() {
  return modal;
}

const popout = {
  current: null,
  show(next) {
    globalBus.once('popout:updated', () => {
      globalBus.emit('popout:open');
    });
    popout.current = next;
    globalBus.emit('popout:update');
  }
};

function usePopout() {
  return popout;
}

function useClearOverlay() {
  const router = useRouter();
  const callback = (fn, type) => () => fn(type);

  return (fn) => {
    switch (router.state) {
      case 'modal':
        globalBus.once('modal:closed', callback(fn, 'modal'));
        globalBus.emit('modal:close');
        return;
      case 'popout':
        globalBus.once('popout:closed', callback(fn, 'popout'));
        globalBus.emit('popout:close');
        return;
      default:
        fn('default');
        return;
    }
  };
}

export {
  useModal,
  usePopout,
  useClearOverlay
};

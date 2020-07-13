import globalBus from '../utils/bus';

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

export {
  useModal,
  usePopout
};

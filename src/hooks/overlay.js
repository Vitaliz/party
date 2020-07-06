const modal = {
  current: null,
  set(next) {
    modal.current = next;
  }
};

function useModal() {
  return modal;
}

const popout = {
  current: null,
  set(next) {
    popout.current = next;
  }
};

function usePopout() {
  return popout;
}

export {
  useModal,
  usePopout
};

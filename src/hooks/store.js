import storage from '../utils/storage';

const store = {
  persist: {},
  user: {},
  game: {}
};

function useStore() {
  return store;
}

function useStorage() {
  return storage;
}

export {
  useStore,
  useStorage
};

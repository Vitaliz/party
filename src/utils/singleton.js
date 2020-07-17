let instances = new Map();
export default {
  getInstance(clazz, ...params) {
    if (instances.has(clazz.name)) {
      return instances.get(clazz.name);
    }

    const instance = new clazz(...params);
    instances.set(clazz.name, instance);
    return instance;
  },
  destroyInstance(clazz) {
    if (instances.has(clazz.name)) {
      instances.delete(clazz.name);
    }
  }
};

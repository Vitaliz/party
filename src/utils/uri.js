import { APP_LINK } from './constants';

export const parseQuery = (query) => {
  return query.slice(1).split('&').reduce((model, param) => {
    const [key, value] = param.split('=');
    model[key] = value;
    return model;
  }, {});
};

export const baseParams = (query) => {
  return btoa(decodeURIComponent(unescape(query.slice(1))));
};

export const generateInviteLink = (type, id) => {
  return `${APP_LINK}#${type}-${id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
};

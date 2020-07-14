import bridge from './bridge';

export const shareLink = (link) => {
  if (bridge.supports('VKWebAppShare')) {
    bridge.send('VKWebAppShare', { link });
  } else if ('share' in window.navigator) {
    try {
      const promise = window.navigator.share({
        title: link
      });

      if (promise.catch) {
        promise.catch(() => { /* ignore */ });
      }
    } catch { /* ignore */ }
  } else {
    window.open(`https://vk.com/share.php?url=${link}`, '_blank');
  }
};

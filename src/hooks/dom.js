import { useRef, useEffect } from '../hooks/base';
import { platform, IOS } from '@vkontakte/vkui';
import { getClosestBody } from '../utils/dom';
import { resize, forcePrevent, PARAM_ACTIVE } from '../utils/events';

const bodies = new Map();
let documentListenerAdded = false;

function useLockBody(locked = true) {
  let element = useRef(document.body);

  useEffect(() => {
    const body = getClosestBody(element.current);
    if (!body) {
      return;
    }

    const bodyInfo = bodies.get(body);

    if (locked) {
      if (!bodyInfo) {
        bodies.set(body, { counter: 1, initialOverflow: body.style.overflow });
        if (platform() === IOS) {
          if (!documentListenerAdded) {
            document.addEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
            documentListenerAdded = true;
          }
        } else {
          body.style.overflow = 'hidden';
        }
      } else {
        bodies.set(body, { counter: bodyInfo.counter + 1, initialOverflow: bodyInfo.initialOverflow });
      }
    } else {
      if (bodyInfo) {
        if (bodyInfo.counter === 1) {
          bodies.delete(body);
          if (platform() === IOS) {
            body.ontouchmove = null;

            if (documentListenerAdded) {
              document.removeEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
              documentListenerAdded = false;
            }
          } else {
            body.style.overflow = bodyInfo.initialOverflow;
          }
        } else {
          bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
        }
      }
    }

    return () => {
      const bodyInfo = bodies.get(body);

      if (bodyInfo) {
        if (bodyInfo.counter === 1) {
          bodies.delete(body);

          document.removeEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
          body.style.overflow = bodyInfo.initialOverflow;
        } else {
          bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
        }
      }
    };
  }, [locked, element]);
}

function useResize() {
  return resize;
}

export {
  useLockBody,
  useResize
};

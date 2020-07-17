import React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect, useLayoutEffect, useMemo, useRef, useImmutableCallback } from '../../hooks/base';
import { usePopout } from '../../hooks/overlay';
import { useRouter } from '../../hooks/router';
import { useBus } from '../../hooks/util';

const PopoutConsumer = ({ by, onClose }) => {
  const popout = usePopout();

  const content = useMemo(() => {
    if (typeof popout.current === 'function') {
      return popout.current({ onClose });
    }
    return null;
  }, [by]);

  return (
    <>{content}</>
  );
};

PopoutConsumer.propTypes = {
  by: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

const PopoutProvider = () => {
  const router = useRouter();
  const bus = useBus();

  const [updateCounter, setUpdateCounter] = useState(0);
  const [showed, setShowedState] = useState(false);
  const mountedRef = useRef();

  const closeByRouter = useImmutableCallback((name) => {
    if (name === 'popout') {
      window.requestAnimationFrame(() => {
        setShowedState(false);
      });
    }
  });

  const open = useImmutableCallback(() => {
    window.requestAnimationFrame(() => {
      setShowedState(true);

      if (router.state !== 'popout') {
        bus.once('router:popstate', closeByRouter);
        router.push('popout');
      }
    });
  });

  const close = useImmutableCallback(() => {
    window.requestAnimationFrame(() => {
      setShowedState(false);

      if (router.state === 'popout') {
        bus.detach('router:popstate', closeByRouter);
        router.back();
      }
    });
  });

  useLayoutEffect(() => {
    if (mountedRef.current) {
      if (showed) {
        window.requestAnimationFrame(() => {
          if (mountedRef.current) {
            bus.emit('popout:opened');
          }
        });
      } else {
        window.requestAnimationFrame(() => {
          if (mountedRef.current) {
            bus.emit('popout:closed');
          }
        });
      }
    }
  }, [showed]);

  useLayoutEffect(() => {
    if (mountedRef.current) {
      bus.emit('popout:updated');
    }
  }, [updateCounter]);

  useEffect(() => {
    mountedRef.current = true;

    const update = () => {
      setUpdateCounter((counter) => counter + 1);
    };

    bus.on('popout:update', update);
    bus.on('popout:open', open);
    bus.on('popout:close', close);

    return () => {
      mountedRef.current = false;

      bus.detach('popout:update', update);
      bus.detach('popout:open', open);
      bus.detach('popout:close', close);
    };
  }, []);

  return showed ? (
    <PopoutConsumer by={updateCounter} onClose={close} />
  ) : null;
};

export default React.memo(PopoutProvider, () => true);

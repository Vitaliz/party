import React from 'react';
import PropTypes from 'prop-types';

import { ActionSheet, ActionSheetItem, usePlatform, IOS } from '@vkontakte/vkui';

import { useState, useCallback, useEffect, useMemo } from '../../hooks/base';
import { usePopout } from '../../hooks/overlay';
import { useRouter } from '../../hooks/router';
import { useBus } from '../../hooks/util';

const PopoutConsumer = ({ by, onClose }) => {
  const platform = usePlatform();
  const popout = usePopout();

  const content = useMemo(() => {
    if (popout.current && popout.current.length) {
      return popout.current.map((item, i) => {
        return (
          <ActionSheetItem
            key={i}
            autoclose={true}
            before={item.icon}
            onClick={item.onClick}
          >{item.label}</ActionSheetItem>
        );
      });
    } else {
      return [];
    }
  }, [by]);

  return popout.current ? (
    <ActionSheet onClose={onClose}>
      {content}
      {platform === IOS && (
        <ActionSheetItem
          autoclose={true}
          mode="cancel"
        >Отменить</ActionSheetItem>
      )}
    </ActionSheet>
  ) : null;
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

  const closeByRouter = useCallback((name) => {
    if (name === 'popout') {
      window.requestAnimationFrame(() => {
        setShowedState(false);
      });
    }
  }, []);

  const show = useCallback(() => {
    window.requestAnimationFrame(() => {
      setShowedState(true);

      if (router.state !== 'popout') {
        bus.once('router:popstate', closeByRouter);
        router.push('popout');
      }
    });
  }, []);

  const close = useCallback(() => {
    window.requestAnimationFrame(() => {
      setShowedState(false);

      if (router.state === 'popout') {
        bus.detach('router:popstate', closeByRouter);
        router.back();
      }
    });
  }, []);

  useEffect(() => {
    const update = () => {
      window.requestAnimationFrame(() => {
        setUpdateCounter(updateCounter + 1);
      });
    };

    bus.on('popout:update', update);

    return () => {
      bus.detach('popout:update', update);
    };
  }, [updateCounter]);

  useEffect(() => {
    bus.on('popout:show', show);
    bus.on('popout:close', close);

    return () => {
      bus.detach('popout:show', show);
      bus.detach('popout:close', close);
    };
  }, []);

  return showed ? (
    <PopoutConsumer by={updateCounter} onClose={close} />
  ) : null;
};

export default React.memo(PopoutProvider, () => true);

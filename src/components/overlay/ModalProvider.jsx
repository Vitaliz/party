import React from 'react';
import PropTypes from 'prop-types';

import { ModalRoot, ModalPage, ModalPageHeader, withModalRootContext } from '@vkontakte/vkui';

import { useState, useImmutableCallback, useEffect, useLayoutEffect, useRef, useMemo } from '../../hooks/base';
import { useRouter } from '../../hooks/router';
import { useModal } from '../../hooks/overlay';
import { useBus } from '../../hooks/util';

const ModalConsumer = withModalRootContext(({ by, onClose, updateModalHeight }) => {
  const modal = useModal();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      updateModalHeight();
    });
  }, [by]);

  const content = useMemo(() => {
    if (typeof modal.current === 'function') {
      return modal.current({ onClose });
    }
    return null;
  }, [by]);

  return (<>{content}</>);
});

ModalConsumer.propTypes = {
  by: PropTypes.number.isRequired,
  updateModalHeight: PropTypes.func
};

const ModalProvider = () => {
  const router = useRouter();
  const bus = useBus();

  const [updateCounter, setUpdateCounter] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const mountedRef = useRef();

  const closeByRouter = useImmutableCallback((name) => {
    if (name === 'modal') {
      window.requestAnimationFrame(() => {
        setActiveModal(null);
      });
    }
  });

  const open = useImmutableCallback(() => {
    window.requestAnimationFrame(() => {
      setActiveModal('modal');

      if (router.state !== 'modal') {
        bus.once('router:popstate', closeByRouter);
        router.push('modal');
      }
    });
  });

  const close = useImmutableCallback(() => {
    window.requestAnimationFrame(() => {
      setActiveModal(null);

      if (router.state === 'modal') {
        bus.detach('router:popstate', closeByRouter);
        router.back();
      }
    });
  });

  useLayoutEffect(() => {
    if (mountedRef.current) {
      if (activeModal) {
        window.requestAnimationFrame(() => {
          if (mountedRef.current) {
            bus.emit('modal:opened');
          }
        });
      } else {
        window.requestAnimationFrame(() => {
          if (mountedRef.current) {
            bus.emit('modal:closed');
          }
        });
      }
    }
  }, [activeModal]);

  useLayoutEffect(() => {
    if (mountedRef.current) {
      bus.emit('modal:updated');
    }
  }, [updateCounter]);

  useEffect(() => {
    mountedRef.current = true;

    const update = () => {
      setUpdateCounter((counter) => counter + 1);
    };

    bus.on('modal:update', update);
    bus.on('modal:open', open);
    bus.on('modal:close', close);

    return () => {
      mountedRef.current = false;

      bus.detach('modal:update', update);
      bus.detach('modal:open', open);
      bus.detach('modal:close', close);
    };
  }, []);

  return (
    <ModalRoot activeModal={activeModal} onClose={close}>
      <ModalPage
        id="modal"
        onClose={close}
        header={<ModalPageHeader left={null} right={null} />}
      >
        <ModalConsumer by={updateCounter} onClose={close} />
      </ModalPage>
    </ModalRoot>
  );
};

export default React.memo(ModalProvider, () => true);

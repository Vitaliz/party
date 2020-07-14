import React from 'react';
import PropTypes from 'prop-types';

import { ModalRoot, ModalPage, ModalPageHeader, withModalRootContext } from '@vkontakte/vkui';

import { useState, useCallback, useEffect, useRef } from '../../hooks/base';
import { useRouter } from '../../hooks/router';
import { useModal } from '../../hooks/overlay';
import { useBus } from '../../hooks/util';

const ModalConsumer = withModalRootContext((props) => {
  const modal = useModal();

  useEffect(() => {
    window.requestAnimationFrame(() => {
      props.updateModalHeight();
    });
  }, [props.by]);

  return (<>{modal.current}</>);
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

  const closeByRouter = useCallback((name) => {
    if (name === 'modal') {
      window.requestAnimationFrame(() => {
        setActiveModal(null);
      });
    }
  }, []);

  const open = useCallback(() => {
    window.requestAnimationFrame(() => {
      setActiveModal('modal');

      if (router.state !== 'modal') {
        bus.once('router:popstate', closeByRouter);
        router.push('modal');
      }
    });
  }, []);

  const close = useCallback(() => {
    window.requestAnimationFrame(() => {
      setActiveModal(null);

      if (router.state === 'modal') {
        bus.detach('router:popstate', closeByRouter);
        router.back();
      }
    });
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      if (activeModal) {
        window.requestAnimationFrame(() => {
          bus.emit('modal:opened');
        });
      } else {
        window.requestAnimationFrame(() => {
          bus.emit('modal:closed');
        });
      }
    }
  }, [activeModal]);

  useEffect(() => {
    if (mountedRef.current) {
      bus.emit('modal:updated');
    }
  }, [updateCounter]);

  useEffect(() => {
    const update = () => {
      window.requestAnimationFrame(() => {
        setUpdateCounter(updateCounter + 1);
      });
    };

    bus.on('modal:update', update);

    return () => {
      bus.detach('modal:update', update);
    };
  }, [updateCounter]);

  useEffect(() => {
    mountedRef.current = true;

    bus.on('modal:open', open);
    bus.on('modal:close', close);

    return () => {
      mountedRef.current = false;

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
        <ModalConsumer by={updateCounter} />
      </ModalPage>
    </ModalRoot>
  );
};

export default React.memo(ModalProvider, () => true);

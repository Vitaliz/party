import React from 'react';

import { ModalRoot, ModalCard } from '@vkontakte/vkui';
import { useCallback, useState, useMemo } from '../../hooks/base';

const PopoutCard = (props) => {
  /* eslint-disable react/prop-types */
  const [active, setActive] = useState('card');

  const onClose = useCallback((e) => {
    setActive(null);
    window.setTimeout(() => {
      props.onClose(e);
    }, 340);
  }, [props.onClose]);

  const actions = useMemo(() => {
    const rawActions = props.actions;
    if (!rawActions || rawActions.length === 0) {
      return null;
    }
    return rawActions.map((action) => {
      if (action.autoclose) {
        return {
          ...action,
          action: (e) => {
            if (typeof action.action === 'function') {
              action.action(e);
            }
            onClose(e);
          }
        };
      }
      return action;
    });
  }, [props.actions]);

  return (
    <ModalRoot
      activeModal={active}
      onClose={onClose}
    >
      <ModalCard
        {...props}
        id="card"
        actions={actions}
        onClose={onClose}
      />
    </ModalRoot>
  );
};

export default PopoutCard;

import React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect, useCallback } from '../../hooks/base';
import { useLockBody } from '../../hooks/dom';
import { usePlatform, Group, Header, List, SimpleCell as Cell } from '@vkontakte/vkui';

const Offline = ({ visible = false }) => {
  const [show, setShow] = useState(visible);
  const [animationType, setAnimationType] = useState('leave');

  const platform = usePlatform();

  useLockBody(visible);

  const handleAnimnationEnd = useCallback(() => {
    if (animationType === 'leave') {
      setShow(false);
    }
  }, [animationType]);

  useEffect(() => {
    if (visible && !show) {
      setShow(true);
      window.requestAnimationFrame(() => {
        setAnimationType('enter');
      });
    } else if (show && !visible) {
      window.requestAnimationFrame(() => {
        setAnimationType('leave');
      });
    }
  }, [visible, show]);

  if (!show) {
    return null;
  }

  return (
    <div
      className={`Offline Offline--${animationType} Offline--${platform}`}
      onAnimationEnd={handleAnimnationEnd}
    >
      <div className="Offline__mask" />
      <div className="Offline__group">
        <Group header={<Header mode="secondary">Интернет пропал</Header>}>
          <List>
            <Cell multiline={true} disabled={true}>Без доступа в Интернет мы не сможем работать</Cell>
          </List>
        </Group>
      </div>
    </div>
  );
};

Offline.propTypes = {
  visible: PropTypes.bool
};

export default React.memo(Offline);

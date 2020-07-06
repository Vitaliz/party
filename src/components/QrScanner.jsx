import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { classNames as cn } from '@vkontakte/vkui';
import QrScannerIcon from '@vkontakte/icons/dist/24/qr';

import { useBridge } from '../hooks/util';

const QrScanner = ({ className }) => {
  const bridge = useBridge();

  const openScanner = useCallback(() => {
    bridge.send('VKWebAppOpenCodeReader');
  }, []);

  if (bridge.supports('VKWebAppOpenCodeReader')) {
    return (
      <button onClick={openScanner} className={cn(className, 'QrScanner')}>
        <QrScannerIcon />
      </button>
    );
  }

  return null;
};

QrScanner.propTypes = {
  className: PropTypes.string
};

export default QrScanner;

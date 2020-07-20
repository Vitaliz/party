import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { classNames as cn } from '@vkontakte/vkui';
import QrIcon from '@vkontakte/icons/dist/28/scan_viewfinder_outline';

import { useBridge } from '../hooks/util';

const QrScannerButton = styled.button`
  background-color: rgba(255, 255, 255, .1);
  border: none;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin: 0;
  height: auto;
  line-height: 1em;
  outline: none;
`;

const QrScannerIcon = styled(QrIcon).attrs(() => ({
  width: 26,
  height: 26
}))`
  color: #fff;
`;

const QrScanner = ({ className }) => {
  const bridge = useBridge();

  const openScanner = useCallback(() => {
    if (bridge.supports('VKWebAppOpenCodeReader')) {
      bridge.send('VKWebAppOpenCodeReader').catch(() => {
        // ignore
      });
      return;
    }

    if (bridge.supports('VKWebAppOpenQR')) {
      bridge.send('VKWebAppOpenQR').catch(() => {
        // ignore
      });
      return;
    }
  }, []);

  if (bridge.supports('VKWebAppOpenCodeReader') || bridge.supports('VKWebAppOpenQR')) {
    return (
      <QrScannerButton onClick={openScanner} className={cn(className, 'QrScanner')}>
        <QrScannerIcon />
      </QrScannerButton>
    );
  }

  return null;
};

QrScanner.propTypes = {
  className: PropTypes.string
};

export default QrScanner;

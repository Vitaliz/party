import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Div } from '@vkontakte/vkui';
import ThemedButton from '../common/ThemedButton';

import qr from '@vkontakte/vk-qr';

import { useCallback, useMemo } from '../../hooks/base';
import { shareLink } from '../../utils/share';

const QRColorTheme = {
  yellow: '#FFA54F'
};

const QRCode = styled.div`
  width: 256px;
  height: 256px;

  margin: 0 auto 12px auto;

  svg {
    display: block;

    max-width: 100%;
    max-height: 100%;
  }
`;

const QRCodeInfo = styled.div`
  margin-bottom: 12px;
  text-align: center;
`;

const QRModal = (props) => {
  const code = useMemo(() => {
    return qr.createQR(props.link, {
      qrSize: 256,
      isShowLogo: true,
      logoColor: QRColorTheme[props.color]
    });
  }, [props.link]);

  const share = useCallback(() => {
    shareLink(props.link);
  }, [props.link]);

  return (
    <Div>
      <QRCode dangerouslySetInnerHTML={{ __html: code }} />
      <QRCodeInfo>
        Покажи этот QR-код другу или поделись с ним ссылкой
      </QRCodeInfo>
      <ThemedButton
        $color={props.color}
        onClick={share}
      >
        Поделиться ссылкой
      </ThemedButton>
    </Div>
  );
};

QRModal.propTypes = {
  link: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue']).isRequired
};

export default QRModal;

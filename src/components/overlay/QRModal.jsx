import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Div, Button } from '@vkontakte/vkui';

import qr from '@vkontakte/vk-qr';

import { useCallback } from '../../hooks/base';
import { shareLink } from '../../utils/share';

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
      isShowLogo: true
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
      <Button onClick={share}>Поделиться ссылкой</Button>
    </Div>
  );
};

QRModal.propTypes = {
  link: PropTypes.string.isRequired
};

export default QRModal;

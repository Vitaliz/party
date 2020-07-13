import React from 'react';
import PropTypes from 'prop-types';

import { View } from '@vkontakte/vkui';

import AliasPlay from '../panels/AliasPlay';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import { useHistory } from '../../../hooks/router';

const AliasGame = ({ id }) => {
  const panels = useHistory('play');

  return (
    <View
      id={id}
      activePanel={panels.activePanel}
      history={panels.history}
      onSwipeBack={panels.goBack}
      modal={<ModalProvider />}
      popout={<PopoutProvider />}
      header={false}
    >
      <AliasPlay id="play" />
    </View>
  );
};

AliasGame.propTypes = {
  id: PropTypes.string.isRequired
};

export default AliasGame;

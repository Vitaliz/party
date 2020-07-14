import React from 'react';
import PropTypes from 'prop-types';

import AliasView from '../components/AliasView';
import AliasPlay from '../panels/AliasPlay';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import { useHistory } from '../../../hooks/router';

const AliasGame = ({ id }) => {
  const panels = useHistory('play');

  return (
    <AliasView
      id={id}
      activePanel={panels.activePanel}
      history={panels.history}
      onSwipeBack={panels.goBack}
      modal={<ModalProvider />}
      popout={<PopoutProvider />}
      header={false}
    >
      <AliasPlay id="play" />
    </AliasView>
  );
};

AliasGame.propTypes = {
  id: PropTypes.string.isRequired
};

export default AliasGame;

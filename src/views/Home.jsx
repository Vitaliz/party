import React from 'react';
import PropTypes from 'prop-types';

import { View } from '@vkontakte/vkui';

import Preview from '../panels/Preview';

import Main from '../panels/Main';
import Alias from '../panels/Alias';
import Stickers from '../panels/Stickers';
import Croco from '../panels/Croco';
import Mafia from '../panels/Mafia';

import PopoutProvider from '../components/overlay/PopoutProvider';
import ModalProvider from '../components/overlay/ModalProvider';

import { useHistory } from '../hooks/router';

const Home = ({ id }) => {
  const panels = useHistory('main');

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
      <Preview
        id="preview"
      />
      <Main
        id="main"
        goForward={panels.goForward}
      />
      <Alias
        id="alias"
        goBack={panels.goBack}
      />
      <Stickers
        id="stickers"
        goBack={panels.goBack}
      />
      <Croco
        id="croco"
        goBack={panels.goBack}
      />
      <Mafia
        id="mafia"
        goBack={panels.goBack}
      />
    </View>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired
};

export default Home;

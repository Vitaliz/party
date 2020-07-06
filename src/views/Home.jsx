import React from 'react';
import PropTypes from 'prop-types';

import { View } from '@vkontakte/vkui';
import Main from '../panels/Main';

import PopoutProvider from '../components/overlay/PopoutProvider';
import ModalProvider from '../components/overlay/ModalProvider';

import { useHistory } from '../hooks/router';

const Home = ({ id }) => {
  const panels = useHistory('main');

  return (
    <View
      activePanel={panels.activePanel}
      history={panels.history}
      onSwipeBack={panels.goBack}
      id={id}
      modal={<ModalProvider />}
      popout={<PopoutProvider />}
      header={false}
    >
      <Main id="main" callback={panels.goForward} />
    </View>
  );
};

Home.propTypes = {
  id: PropTypes.string.isRequired
};

export default Home;

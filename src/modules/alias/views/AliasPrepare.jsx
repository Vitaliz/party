import React from 'react';
import PropTypes from 'prop-types';

import AliasView from '../components/AliasView';
import AliasTeams from '../panels/AliasTeams';
import AliasSettings from '../panels/AliasSettings';

import PopoutProvider from '../../../components/overlay/PopoutProvider';
import ModalProvider from '../../../components/overlay/ModalProvider';

import { useHistory } from '../../../hooks/router';
import { useImmutableCallback, useMount } from '../../../hooks/base';
import { useBus } from '../../../hooks/util';
import { useStore } from '../../../hooks/store';

const AliasPrepare = ({ id }) => {
  const store = useStore();
  useMount(() => {
    store.game = {};
  });

  const panels = useHistory('settings');

  const bus = useBus();

  const close = useImmutableCallback(() => {
    bus.emit('app:view', 'home');
  });

  const start = useImmutableCallback(() => {
    bus.emit('app:view', 'alias-game');
  });

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
      <AliasSettings id="settings" goBack={close} goForward={panels.goForward} />
      <AliasTeams id="teams" goBack={panels.goBack} goForward={start} />
    </AliasView>
  );
};

AliasPrepare.propTypes = {
  id: PropTypes.string.isRequired
};

export default AliasPrepare;

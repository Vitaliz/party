import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';

import { useMemo, useUnmount } from '../../../hooks/base';
import { useStore } from '../../../hooks/store';

import Core from '../core';

const AliasPlay = ({ id }) => {
  const store = useStore();
  useUnmount(() => {
    store.game = {};
  });

  const core = useMemo(() => {
    return new Core(store.user.id);
  }, []);

  console.log(core);

  return (
    <GradientPanel
      id={id}
      title="Команды"
      color="yellow"
    >

    </GradientPanel>
  );
};

AliasPlay.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasPlay;

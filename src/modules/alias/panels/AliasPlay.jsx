import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';

import { useUnmount } from '../../../hooks/base';
import { useStore } from '../../../hooks/store';

const AliasPlay = ({ id }) => {
  const store = useStore();
  useUnmount(() => {
    store.game = {};
  });

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

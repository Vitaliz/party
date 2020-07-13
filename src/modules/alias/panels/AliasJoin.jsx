import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';

import { useImmutableCallback } from '../../../hooks/base';

const AliasJoin = ({ id, goBack, goForward }) => {
  const openSettings = useImmutableCallback(() => {
    goForward('settings');
  });

  return (
    <GradientPanel
      id={id}
      onClose={goBack}
      title="Команды"
      color="yellow"
    >
      <button onClick={openSettings}>Далее</button>
    </GradientPanel>
  );
};

AliasJoin.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasJoin;

import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';

const AliasJoin = ({ id, goBack }) => {
  return (
    <GradientPanel
      id={id}
      onBack={goBack}
      title="Лобби"
      color="yellow"
    >
    </GradientPanel>
  );
};

AliasJoin.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasJoin;

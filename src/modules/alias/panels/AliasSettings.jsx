import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';


const AliasSettings = ({ id, goBack, goForward }) => {
  return (
    <GradientPanel
      id={id}
      onClose={goBack}
      title="Настройки"
      color="yellow"
    >
      <button onClick={goForward}>Далее</button>
    </GradientPanel>
  );
};

AliasSettings.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired
};

export default AliasSettings;

import React from 'react';
import PropTypes from 'prop-types';

import HillPanel from '../components/panel/HillPanel';

const Croco = ({ id, goBack }) => {
  return (
    <HillPanel
      id={id}
      callback={goBack}
      title="Крокодил"
      affix="Описание"
      color="green"
    >
      TODO
    </HillPanel>
  );
};

Croco.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Croco;

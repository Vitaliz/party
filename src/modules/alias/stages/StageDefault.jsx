import React from 'react';
import styled from 'styled-components/macro';

import { PanelSpinner } from '@vkontakte/vkui';

const Loader = styled(PanelSpinner).attrs(() => ({
  size: 'medium',
  height: 200
}))`
  &.Spinner {
    color: #fff;
  }
`;

/**
 * Stage default
 */
const StageDefault = () => {
  return (
    <Loader />
  );
};

export default StageDefault;

import React from 'react';

import { ConfigProvider as ConfigContextProvider, SSRWrapper } from '@vkontakte/vkui';
import { useCompute } from '../../hooks/base';

const ConfigProvider = (props) => {
  const userAgent = useCompute(() => {
    return window.navigator.userAgent;
  });

  return (
    <SSRWrapper userAgent={userAgent}>
      <ConfigContextProvider {...props} />
    </SSRWrapper>
  );
};

export default ConfigProvider;

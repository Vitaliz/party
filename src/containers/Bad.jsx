import React from 'react';
import styled from 'styled-components/macro';

import { View, Panel, Title, Subhead, FixedLayout, Button, Div } from '@vkontakte/vkui';
import IconBlock from '@vkontakte/icons/dist/56/do_not_disturb_outline';

import { useImmutableCallback } from '../hooks/base';
import { useBridge } from '../hooks/util';
import { useRouter } from '../hooks/router';

const Icon = styled(IconBlock).attrs(() => ({
  width: 56,
  height: 56
}))`
  color: #3F8AE0;
  color: var(--accent);
`;

const Bad = () => {
  const bridge = useBridge();
  const router = useRouter();

  const close = useImmutableCallback(() => {
    if (bridge.supports('VKWebAppClose')) {
      bridge.send('VKWebAppClose', { status: 'success' });
    } else {
      router.back();
    }
  });

  return (
    <View activePanel="sorry">
      <Panel
        id="sorry"
        centered={true}
        separator={false}
      >
        <Icon />
        <Div>
          <Title
            level="2"
            weight="semibold"
          >
            Веселья не будет
          </Title>
        </Div>
        <Subhead weight="regular">
          Ваше устройство не поддерживается
        </Subhead>
        <FixedLayout
          vertical="bottom"
          separator={false}
        >
          <Div>
            <Button
              size="xl"
              mode="primary"
              onClick={close}
            >
              Закрыть
            </Button>
          </Div>
        </FixedLayout>
      </Panel>
    </View>
  );
};

export default Bad;

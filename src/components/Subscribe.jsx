import React from 'react';
import styled from 'styled-components/macro';

import { useStore } from '../hooks/store';
import { useBridge } from '../hooks/util';
import { useState, useCallback, useCompute } from '../hooks/base';

import { APP_GROUP } from '../utils/constants';

import Clickable from './common/Clickable';

const SubscribeShadow = styled.div`
  background-color: #FF8197;

  border-radius: 20px;
  overflow: hidden;

  padding-bottom: 4px;
`;

const SubscribeContainer = styled.button`
  background-image: linear-gradient(100deg, #FFC3A0 0%, #FFAFBD 100%);

  position: relative;
  border-radius: 0 0 20px 20px;
  overflow: hidden;

  padding: 16px 20px;
`;

const SubscribeTitle = styled.div`
  font-size: 16px;
  line-height: 20px;

  color: rgba(0, 0, 0, 0.7);

  margin-bottom: 4px;
`;

const SubscribeDescription = styled.div`
  font-size: 12px;
  line-height: 16px;

  color: #fff;
`;

const SubscribeImage = styled.img`
  position: absolute;
  right: 20px;
  top: 50%;
  width: 90px;
  height: 40px;
  transform: translateY(-50%);
`;

const Subscribe = (props) => {
  const bridge = useBridge();
  const store = useStore();
  const [follower, setFollower] = useState(store.user?.is_follower || !bridge.supports('VKWebAppJoinGroup'));

  const follow = useCallback(() => {
    if (!follower) {
      bridge.send('VKWebAppJoinGroup', {
        'group_id': APP_GROUP
      }).then((data) => {
        store.user.is_follower = data && data.result;
        setFollower(store.user.is_follower);
      }).catch(() => {
        setFollower(false);
      });
    } else {
      window.open(`${bridge.isWebView() ? 'vk' : 'https'}://vk.com/public${APP_GROUP}`);
    }
  }, [follower]);

  const title = useCompute(() => {
    return follower ? 'Наша группа' : 'Подпишись на нас';
  });

  return (
    <SubscribeShadow {...props}>
      <SubscribeContainer as={Clickable} onClick={follow}>
        <SubscribeTitle>{title}</SubscribeTitle>
        <SubscribeDescription>Узнавай о новых играх!</SubscribeDescription>
        <SubscribeImage
          src={require(/* webpackPreload: true */ '../assets/faces.png')}
          alt="Эмоции"
        />
      </SubscribeContainer>
    </SubscribeShadow>
  );
};

export default Subscribe;

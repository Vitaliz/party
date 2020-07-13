import React from 'react';
import styled from 'styled-components/macro';

import { useStore } from '../hooks/store';
import { useBridge } from '../hooks/util';
import { useState, useImmutableCallback, useCompute } from '../hooks/base';

import { APP_GROUP } from '../utils/constants';

import Clickable from './common/Clickable';

const SubscribeShadow = styled.div`
  background-color: #FF8197;

  border-radius: 20px;
  overflow: hidden;

  padding-bottom: 4px;
`;

const SubscribeContainer = styled.div`
  display: block;
  text-decoration: none;

  border: none;
  outline: none;
  margin: 0;

  position: relative;
  top: 0;

  width: 100%;
  text-align: left;

  background-image: linear-gradient(100deg, #FFC3A0 0%, #FFAFBD 100%);

  border-radius: 0 0 20px 20px;
  overflow: hidden;

  padding: 16px 20px;
  box-sizing: border-box;
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
  const [isFollower, setFollower] = useState(store.user?.is_follower || !bridge.supports('VKWebAppJoinGroup'));

  const follow = useImmutableCallback(() => {
    bridge.send('VKWebAppJoinGroup', {
      'group_id': APP_GROUP
    }).then((data) => {
      store.user.is_follower = data && data.result;
      setFollower(store.user.is_follower);
    }).catch(() => {
      setFollower(false);
    });
  });

  const component = useCompute(() => {
    return isFollower ? 'a' : 'button';
  });

  const onClick = useCompute(() => {
    return isFollower ? null : follow;
  });

  const title = useCompute(() => {
    return isFollower ? 'Наша группа' : 'Подпишись на нас';
  });

  const link = useCompute(() => {
    return `${bridge.isWebView() ? 'vk' : 'https'}://vk.com/public${APP_GROUP}`;
  });

  return (
    <SubscribeShadow {...props}>
      <SubscribeContainer
        as={Clickable}
        component={component}
        onClick={onClick}
        href={link}
        target="_blank"
      >
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

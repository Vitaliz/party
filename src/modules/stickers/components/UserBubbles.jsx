import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components/macro';
import {Avatar} from '@vkontakte/vkui';

const UserBubblesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: space-around;
  align-items: center;
`;

const UserBubblesItem = styled.div`
  margin: 15px;
`;

const UserItem = ({user}) => {
  return (
    <UserBubblesItem>
      <Avatar src={user.avatar} size={72} />
    </UserBubblesItem>
  );
};

const UserBubbles = ({gameUsers}) => {
  return (
    <UserBubblesWrapper>
      {gameUsers.map((gameUser) => {
        return (
          <UserItem key={gameUser.user.id} user={gameUser.user} />
        );
      })}
    </UserBubblesWrapper>
  );
};

UserBubbles.propTypes = {
  gameUsers: PropTypes.array.isRequired
};

UserItem.propTypes = {
  user: PropTypes.object.isRequired
};

export default UserBubbles;

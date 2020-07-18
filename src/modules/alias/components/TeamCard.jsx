import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Card, UsersStack, Title, Caption } from '@vkontakte/vkui';
import IconCheck from '@vkontakte/icons/dist/16/check_circle';
import Clickable from '../../../components/common/Clickable';

import { useMemo, useCallback, useCompute } from '../../../hooks/base';

import { declOfNum } from '../../../utils/data';

const PEOPLE = ['человек', 'человека', 'человек'];
const PLACE = ['свободное место', 'свобоных места', 'свободных мест'];

const TeamCardUnified = styled(Card).attrs(() => ({
  mode: 'tint',
  size: 'l'
}))`
  background-color: #fff;
  padding: 52px 40px 8px 40px;

  margin-bottom: 12px;
`;

const TeamCardTitle = styled(Title).attrs(() => ({
  level: '1',
  weight: 'heavy'
}))`
  color: #FFA000;
`;

const TeamCardCaption = styled(Caption).attrs(() => ({
  level: '1',
  weight: 'regular',
  caps: false
}))`
  color: #818C99;
  margin-bottom: 40px;
`;

const TeamCardCheck = styled(IconCheck).attrs(() => ({
  width: 24,
  height: 24
}))`
  color: #FFA000;
  position: absolute;
  top: -36px;
  right: -24px;
`;

const TeamCardUsers = styled(UsersStack).attrs(() => ({
  layout: 'horizontal',
  size: 's'
}))`
  height: 24px;
  padding: 8px 0;

  .UsersStack__photos:empty + .UsersStack__text {
    margin-left: 0;
  }

  .UsersStack__text {
    font-weight: 400;
  }
`;

const TeamCard = ({ onClick, users, max, name, checked }) => {
  const free = useCompute(() => {
    return max - users.length;
  });

  const after = useMemo(() => {
    const avatars = users.map((user) => user.avatar);

    let description = 'В команде ';
    if (users.length === 0) {
      description += 'никого нет';
    } else if (users.length === 1) {
      description += users[0].firstName;
    } else {
      description += `${users.length} ${declOfNum(users.length, PEOPLE)}`;
    }

    const place = free <= 0 ?
      'Свободных мест нет' :
      `${free} ${declOfNum(free, PLACE)}`;

    return (
      <>
        <TeamCardCaption>
          {place}
        </TeamCardCaption>
        <TeamCardUsers
          photos={avatars}
          visibleCount={3}
        >
          {description}
        </TeamCardUsers>
      </>
    );
  }, [users, free]);

  const onToggle = useCallback(() => {
    if (free > 0) {
      onClick(name);
    }
  }, [onClick, name]);

  return (
    <Clickable
      component={TeamCardUnified}
      mode="tint"
      size="l"
      onClick={onToggle}
    >
      {checked && (<TeamCardCheck />)}
      <TeamCardTitle>
        {name}
      </TeamCardTitle>
      {after}
    </Clickable>
  );
};

TeamCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({
    firstName: PropTypes.string,
    avatar: PropTypes.string
  })).isRequired,
  max: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
};

export default TeamCard;

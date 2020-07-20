import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';

import styled from 'styled-components/macro';
import {parseQuery} from '../../../utils/uri';
import { Avatar, Input } from '@vkontakte/vkui';

import {useState} from '../../../hooks/base';

const Header = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
`;

const HeaderUser = styled.div`
  display: flex;
  align-items: center;
  margin-left: 4px;

  .Avatar {
    margin-left: 4px;
  }
`;

const Content = styled.div`
  margin-top: 10px;
`;

/**
 * Join screen
 *
 * @param {Object} props
 */
const StickersPrepare = ({id, game, start}) => {
  const [word, setWord] = useState(null);
  const [status, setStatus] = useState('default');

  const checkStart = () => {
    if (!word || word.trim() === '') {
      setStatus('error');
      return;
    }

    start(word);
  };

  const onInput = (e) => {
    setWord(e.target.value);

    if (!word || word.trim() === '') {
      setStatus('error');
    } else {
      setStatus('default');
    }
  };

  const gameUsers = game.gameUsers;

  const query = parseQuery(window.location.search);

  const currentUser = gameUsers.find((gameUser) => {
    return gameUser.user.vkUserId === +query.vk_user_id;
  });

  return (
    <GradientPanel
      id={id}
      title="Подготовка"
      color="blue"
      postfix={(
        <div>
          <ThemedButton
            $color="blue"
            $overlay={true}
            onClick={checkStart}
          >
            Далее
          </ThemedButton>
        </div>
      )}
    >
      <div>
        <Header>
          <div>Слово для</div>
          <HeaderUser>
            <div>{currentUser.attachedGameUser.user.firstName}</div>
            <Avatar src={currentUser.attachedGameUser.user.avatar} size={28}/>
          </HeaderUser>
        </Header>
        <Content>
          <Input status={status} required={true} onInput={onInput} placeholder="Например: Оби Ван Кеноби"/>
        </Content>
      </div>
    </GradientPanel>
  );
};

StickersPrepare.propTypes = {
  id: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  start: PropTypes.func.isRequired,
};

export default StickersPrepare;

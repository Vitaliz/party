import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';

import styled from 'styled-components/macro';
import {parseQuery} from '../../../utils/uri';
import {Avatar, Button, Input} from '@vkontakte/vkui';

import {useMemo, useState} from '../../../hooks/base';

import {ReactComponent as DashIcon} from '../../../assets/dash.svg';
import {useFetch} from '../../../hooks/fetch';

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
  width: 100%;
  margin-top: 10px;
  display: flex;

  .Input {
    flex-grow: 1;

    input {
      height: 100%;
    }
  }
`;


const RandomIcon = styled(Button)`
  position: relative;
  background-color: #fff;
  border: 0;
  padding: 0;
  margin-left: 20px;

  svg {
    width: 38px;
    height: 38px;
    fill: #40BCFF;
  }

  .Button__content {
    padding: 0 3px;
  }
`;

const TooltipWrapper = styled.div`
  margin-top: 20px;

  .Tooltip__container {
    position: relative;
  }

  .Tooltip__content {
    max-width: 100%;
  }

  .Tooltip__corner {
    right: 14px;
    top: -8px;
  }

  .Tooltip__text {
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
`;

/**
 * Join screen
 *
 * @param {Object} props
 */
const StickersPrepare = ({id, game, start, close}) => {
  const [word, setWord] = useState(null);
  const [status, setStatus] = useState('default');
  const fetch = useFetch();

  const checkStart = () => {
    if (!word || word.length < 2 || word.length > 32) {
      setStatus('error');
      return;
    }

    start(word);
  };

  const fetchWord = () => {
    fetch.get('/vkma/stickers/word').then(({data}) => {
      const word = data.data;

      setWord(word.value);
    });
  };

  const onInput = (e) => {
    const value = String(e.target.value).trim();

    setWord(value);

    if (!value) {
      setStatus('error');
    } else {
      setStatus('default');
    }
  };

  const gameUsers = useMemo(() => {

    if (!game) {
      return [];
    }

    return game.gameUsers;
  }, [game]);

  const query = parseQuery(window.location.search);

  const currentUser = gameUsers.find((gameUser) => {
    return gameUser.user.vkUserId === +query.vk_user_id;
  });

  return (
    <GradientPanel
      id={id}
      title="Подготовка"
      color="blue"
      onClose={close}
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
          {currentUser && currentUser.attachedGameUser && currentUser.attachedGameUser.user && <HeaderUser>
            <div>{currentUser.attachedGameUser.user.firstName}</div>
            <Avatar src={currentUser.attachedGameUser.user.avatar} size={28}/>
          </HeaderUser>}
        </Header>
        <Content>
          <Input
            status={status}
            required={true}
            value={word}
            onInput={onInput}
            placeholder="Например: Оби Ван Кеноби"
            minLength={2}
            maxLength={32}
          />
          <RandomIcon onClick={fetchWord}>
            <DashIcon />
          </RandomIcon>
        </Content>
        <TooltipWrapper>
          <div className="Tooltip--ios Tooltip--light">
            <div className="Tooltip__container">
              <div className="Tooltip__corner"></div>
              <div className="Tooltip__content">
                <div className="Tooltip__text">Не можешь придумать слово? Просто нарандомь его!</div>
              </div>
            </div>
          </div>
        </TooltipWrapper>
      </div>
    </GradientPanel>
  );
};

StickersPrepare.propTypes = {
  id: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  start: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

export default StickersPrepare;

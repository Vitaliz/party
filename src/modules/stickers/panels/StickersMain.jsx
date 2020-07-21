import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import {parseQuery} from '../../../utils/uri';
import {Avatar} from '@vkontakte/vkui';
import styled from 'styled-components/macro';
import ThemedButton from '../../../components/common/ThemedButton';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import {useMemo} from '../../../hooks/base';

const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  max-width: 100%;
`;

const AvatarIcon = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate3d(-50%, 50%, 0);
  background-color: #fff;
  border-radius: 100%;
  z-index: 2;
  color: #3F8AE0;
  padding: 6px;
`;

const PlayerAvatar = styled.div`
  position: relative;
`;

const PlayerWord = styled.div`
  background-color: #fff;
  flex-grow: 1;
  padding: 15px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #3F8AE0;
  margin-left: 30px;
  border-radius: 10px;

  overflow-wrap: normal;
  word-break: normal;
  word-wrap: normal;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const StickersPlayer = ({gameUser, word}) => {
  return (
    <PlayerWrapper>
      <PlayerAvatar>
        <Avatar src={gameUser.user.avatar} size={72}/>
        {gameUser.isFinished && (
          <AvatarIcon><Icon16Done/></AvatarIcon>
        )}
      </PlayerAvatar>
      <PlayerWord>{word}</PlayerWord>
    </PlayerWrapper>
  );
};

/**
 * Join screen
 *
 * @param {Object} props
 */
const StickersMain = ({id, game, wordGot, restartGame, close}) => {
  const gameUsers = useMemo(() => {
    if (!game) {
      return [];
    }

    return game.gameUsers;
  }, [game]);

  const query = parseQuery(window.location.search);

  const isCreator = useMemo(() => {
    if (!game) {
      return false;
    }
    const query = parseQuery(window.location.search);
    return +query.vk_user_id === game.creator.vkUserId;
  }, [game]);

  const currentUser = gameUsers.find((gameUser) => {
    return gameUser.user.vkUserId === +query.vk_user_id;
  });

  const getWord = (gameUser) => {
    if (gameUser.user.id === currentUser.user.id && !gameUser.isFinished) {
      return '???';
    }

    if (!gameUser.word) {
      return '...';
    }

    return gameUser.word;
  };

  return (
    <GradientPanel
      id={id}
      title="Игра!"
      onClose={(game && game.finishedAt) !== null && close}
      color="blue"
      postfix={(
        <div>
          {(currentUser && !currentUser.isFinished) && <ThemedButton
            $color="blue"
            $overlay={true}
            onClick={wordGot}
          >
            Я угадал!
          </ThemedButton>}
          {(isCreator && game && game.finishedAt !== null) && <ThemedButton
            $color="blue"
            $overlay={true}
            onClick={restartGame}
          >
            Начать новую
          </ThemedButton>}
        </div>
      )}
    >
      <div>
        {gameUsers.map((gameUser) => {
          return (
            <StickersPlayer key={gameUser.user.id} gameUser={gameUser} word={getWord(gameUser)}/>
          );
        })}
      </div>
    </GradientPanel>
  );
};

StickersMain.propTypes = {
  id: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  wordGot: PropTypes.func.isRequired,
  restartGame: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};

StickersPlayer.propTypes = {
  gameUser: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default StickersMain;

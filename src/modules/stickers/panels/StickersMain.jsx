import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import {parseQuery} from '../../../utils/uri';
import {Avatar} from '@vkontakte/vkui';
import styled from 'styled-components/macro';
import ThemedButton from '../../../components/common/ThemedButton';
import Icon16Done from '@vkontakte/icons/dist/16/done';


const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
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
`;

const StickersPlayer = ({gameUser, word}) => {
  return (
    <PlayerWrapper>
      <PlayerAvatar>
        <Avatar src={gameUser.user.avatar} size={72}/>

        {gameUser.isFinished && (
          <AvatarIcon><Icon16Done /></AvatarIcon>
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
const StickersMain = ({id, game, close, wordGot}) => {

  const gameUsers = game.gameUsers;

  console.log('gu', gameUsers);

  const query = parseQuery(window.location.search);


  const currentUser = gameUsers.find((gameUser) => {
    return gameUser.user.vkUserId === +query.vk_user_id;
  });

  const getWord = (gameUser) => {
    if (gameUser.user.id === currentUser.user.id && !gameUser.isFinished) {
      return '???';
    }

    if (gameUser.word) {
      return '...';
    }

    return gameUser.word;
  };

  console.log(currentUser);

  return (
    <GradientPanel
      id={id}
      title="Лобби"
      color="blue"
      onClose={close}
      postfix={(
        <div>

          <ThemedButton
            $color="blue"
            $overlay={true}
            onClick={wordGot}
          >
            Я угадал!
          </ThemedButton>

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
  close: PropTypes.func.isRequired,
  wordGot: PropTypes.func.isRequired
};

StickersPlayer.propTypes = {
  gameUser: PropTypes.object.isRequired,
  word: PropTypes.string.isRequired
};

export default StickersMain;

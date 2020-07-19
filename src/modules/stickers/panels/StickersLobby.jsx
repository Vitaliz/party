import React from 'react';
import PropTypes from 'prop-types';

import GradientPanel from '../../../components/panel/GradientPanel';
import ThemedButton from '../../../components/common/ThemedButton';
import QRModal from '../../../components/overlay/QRModal';

import styled from 'styled-components/macro';


import {useImmutableCallback} from '../../../hooks/base';
import {useModal} from '../../../hooks/overlay';

import {generateInviteLink} from '../../../utils/uri';
import UserBubbles from '../components/UserBubbles';


const ConnectingTitle = styled.div`
  color: #fff;
  font-size: 28px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Btn = styled.div`
  margin-bottom: 12px;
`;

/**
 * Join screen
 *
 * @param {Object} props
 */
const StickersLobby = ({id, game, goBack, isCreator, start}) => {
  const modal = useModal();

  const showQR = useImmutableCallback(() => {
    const link = generateInviteLink('stickers', game.id);

    modal.show(() => (
      <QRModal link={link} color="blue"/>
    ));
  });

  return (
    <GradientPanel
      id={id}
      onBack={goBack}
      title="Лобби"
      color="blue"
      postfix={(
        <div>
          <ConnectingTitle>Подключение...</ConnectingTitle>
          {isCreator && (
            <>
              <Btn>
                <ThemedButton
                  $color="blue"
                  $overlay={true}
                  onClick={showQR}
                >
                  Пригласить
                </ThemedButton>
              </Btn>
              <Btn>
                <ThemedButton
                  $color="blue"
                  $overlay={true}
                  onClick={start}
                >
                  Начать
                </ThemedButton>
              </Btn>
            </>
          )}

        </div>
      )}
    >
      {game && <UserBubbles gameUsers={game.gameUsers}/>}
    </GradientPanel>
  );
};

StickersLobby.propTypes = {
  id: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired,
  isCreator: PropTypes.bool.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  start: PropTypes.func.isRequired
};

export default StickersLobby;

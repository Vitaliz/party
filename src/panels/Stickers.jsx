import React from 'react';
import PropTypes from 'prop-types';

import Affix from '../components/common/Affix';
import RoundButton from '../components/common/RoundButton';
import HillPanel from '../components/panel/HillPanel';
import StickersRules from '../components/rules/StickersRules';

import { useModal } from '../hooks/overlay';
import { useImmutableCallback } from '../hooks/base';

import { SETTINGS } from '../utils/constants';
import {useBus} from '../hooks/util';

const Stickers = ({ id, goBack }) => {
  const modal = useModal();
  const bus = useBus();

  const prepare = useImmutableCallback(() => {
    bus.emit('app:view', 'stickers-game');
  });

  const openRules = useImmutableCallback(() => {
    modal.show(() => (
      <StickersRules />
    ));
  });

  return (
    <HillPanel
      id={id}
      callback={goBack}
      goForward={prepare}
      goBack={goBack}
      title="Стикерочки"
      count={SETTINGS.stickers.count}
      time={SETTINGS.stickers.time}
      color="blue"
      postfix="Начать"
      affix={(
        <Affix>
          <span>Описание</span>
          <RoundButton onClick={openRules}>Правила</RoundButton>
        </Affix>
      )}
    >
      Стикерочки — игра, целью которой
      является угадывание слова, которое
      закадывает вам ваш товарищ по игре.
      Игра заканчивается после того,
      как все игроки угадают свои слова.
    </HillPanel>
  );
};

Stickers.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Stickers;

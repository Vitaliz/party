import React from 'react';
import PropTypes from 'prop-types';

import Affix from '../components/common/Affix';
import RoundButton from '../components/common/RoundButton';
import HillPanel from '../components/panel/HillPanel';
import MafiaRules from '../components/rules/MafiaRules';

import { useModal } from '../hooks/overlay';
import { useImmutableCallback } from '../hooks/base';

import { SETTINGS } from '../utils/constants';

const Mafia = ({ id, goBack }) => {
  const modal = useModal();

  const openRules = useImmutableCallback(() => {
    modal.show(() => (
      <MafiaRules />
    ));
  });

  const prepare = () => {
    // TODO
  };

  return (
    <HillPanel
      id={id}
      goBack={goBack}
      goForward={prepare}
      title="Мафия"
      count={SETTINGS.alias.count}
      time={SETTINGS.alias.time}
      color="gray"
      affix={(
        <Affix>
          <span>Описание</span>
          <RoundButton onClick={openRules}>Правила</RoundButton>
        </Affix>
      )}
      postfix="Скоро"
      disabled={true}
    >
      Мафия — командная пошаговая психологическая игра
      с детективным сюжетом, где каждый может оказаться
      как мирным жителем или комиссаром, представляющим
      правосудие, так и грозным мафиози, держащим в
      страхе весь город.
    </HillPanel>
  );
};

Mafia.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Mafia;

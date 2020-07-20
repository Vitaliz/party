import React from 'react';
import PropTypes from 'prop-types';

import Affix from '../components/common/Affix';
import RoundButton from '../components/common/RoundButton';
import HillPanel from '../components/panel/HillPanel';
import CrocoRules from '../components/rules/CrocoRules';

import { useModal } from '../hooks/overlay';
import { useImmutableCallback } from '../hooks/base';

import { SETTINGS } from '../utils/constants';

const Croco = ({ id, goBack }) => {
  const modal = useModal();

  const openRules = useImmutableCallback(() => {
    modal.show(() => (
      <CrocoRules />
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
      title="Крокодил"
      count={SETTINGS.alias.count}
      time={SETTINGS.alias.time}
      color="green"
      affix={(
        <Affix>
          <span>Описание</span>
          <RoundButton onClick={openRules}>Правила</RoundButton>
        </Affix>
      )}
      postfix="Скоро"
      disabled={true}
    >
      Крокодил – классическая словестная игра,
      основным правилом которой является
      показывание слов жестами  или движениями
      без словестного произношения.
    </HillPanel>
  );
};

Croco.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Croco;

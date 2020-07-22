import React from 'react';
import PropTypes from 'prop-types';

import Affix from '../components/common/Affix';
import RoundButton from '../components/common/RoundButton';
import HillPanel from '../components/panel/HillPanel';
import AliasRules from '../components/rules/AliasRules';

import { useModal } from '../hooks/overlay';
import { useImmutableCallback } from '../hooks/base';
import { useBus } from '../hooks/util';

import { SETTINGS } from '../utils/constants';

const Alias = ({ id, goBack }) => {
  const bus = useBus();
  const modal = useModal();

  const openRules = useImmutableCallback(() => {
    modal.show(() => (
      <AliasRules />
    ));
  });

  const prepare = useImmutableCallback(() => {
    bus.emit('app:view', 'alias-prepare');
  });

  return (
    <HillPanel
      id={id}
      goBack={goBack}
      goForward={prepare}
      title="Алиас"
      count={SETTINGS.alias.count}
      time={SETTINGS.alias.time}
      color="yellow"
      affix={(
        <Affix>
          <span>Описание</span>
          <RoundButton onClick={openRules}>Правила</RoundButton>
        </Affix>
      )}
      postfix="Скоро"
      disabled={false}
    >
      Алиас — классика настольных игр
      по объяснению слов. Каждый из
      игроков по очереди должен за
      ограниченное время объяснить
      своей команде слова, указанные
      на игровых карточках. Игра
      встречается в множестве популярных
      сериалов, например, в &#171;Доктор Хаус&#187;!
    </HillPanel>
  );
};

Alias.propTypes = {
  id: PropTypes.string.isRequired,
  goBack: PropTypes.func.isRequired
};

export default Alias;

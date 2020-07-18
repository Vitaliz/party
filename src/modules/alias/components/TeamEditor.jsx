import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Input } from '@vkontakte/vkui';
import PopoutCard from '../../../components/overlay/PopoutCard';

import { useRef, useCompute } from '../../../hooks/base';

const TeamEditorCard = styled(PopoutCard)`
  .Button--lvl-secondary {
    color: #FFA000;
  }

  .Button--lvl-primary {
    background-color: #FFA000;
  }

  .FormField.Input .Input__el:focus ~ .FormField__border {
    border-color: #FFA000;
  }
`;

const TeamEditor = ({ onClose, onSave, onRemove, edit }) => {
  const value = useRef(edit);

  const actions = useCompute(() => {
    const onClickRemove = () => {
      onRemove(edit);
    };

    const onClickSave = () => {
      if (!value.current) {
        onRemove(edit);
      } else {
        onSave(edit, value.current);
      }
    };

    const removeActionTitle = edit ?
      'Удалить' : 'Отмена';

    return [{
      title: removeActionTitle,
      mode: 'secondary',
      action: onClickRemove,
      autoclose: true
    }, {
      title: 'Сохранить',
      mode: 'primary',
      action: onClickSave,
      autoclose: true
    }];
  });

  const layout = useCompute(() => {
    return window.matchMedia && window.matchMedia('(min-width: 360px)').matches ?
      'horizontal' : 'vertical';
  });

  const onChange = (e) => {
    value.current = e.target.value;
  };

  return (
    <TeamEditorCard
      actionsLayout={layout}
      actions={actions}
      header="Название команды"
      onClose={onClose}
    >
      <Input
        type="text"
        defaultValue={edit}
        onChange={onChange}
      />
    </TeamEditorCard>
  );
};

TeamEditor.propTypes = {
  edit: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TeamEditor;

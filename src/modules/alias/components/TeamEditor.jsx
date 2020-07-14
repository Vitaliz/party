import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Input, Group, Header, SimpleCell as Cell, Div, Button } from '@vkontakte/vkui';
import { useRef } from '../../../hooks/base';
import { useRouter } from '../../../hooks/router';

const Row = styled(Div)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const TeamEditor = (props) => {
  const router = useRouter();
  const edit = useRef(props.edit);

  const onSave = () => {
    if (!edit) {
      props.onRemove(props.edit);
    } else {
      props.onSave(props.edit, edit.current);
    }
    router.back();
  };

  const onRemove = () => {
    props.onRemove(props.edit);
    router.back();
  };

  const onChange = (e) => {
    edit.current = e.target.value;
  };

  return (
    <Group header={<Header mode="secondary">Название команды</Header>}>
      <Cell disabled={true}>
        <Input type="text" defaultValue={props.edit} onChange={onChange} />
      </Cell>
      <Row>
        <Button
          size="xl"
          stretched={true}
          mode="destructive"
          onClick={onRemove}
        >
          Удалить
        </Button>
        <Button
          size="xl"
          align="right"
          after="ic"
          stretched={true}
          mode="primary"
          onClick={onSave}
        >
          Сохранить
        </Button>
      </Row>
    </Group>
  );
};

TeamEditor.propTypes = {
  edit: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default TeamEditor;

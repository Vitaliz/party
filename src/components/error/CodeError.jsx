import React from 'react';
import { Group, Header, SimpleCell as Cell } from '@vkontakte/vkui';

const CodeError = () => {
  return (
    <Group header={<Header mode="secondary">Что-то пошло не так</Header>}>
      <Cell multiline={true} disabled={true}>
        По отсканированному коду ничего не нашлось.
      </Cell>
    </Group>
  );
};

export default CodeError;

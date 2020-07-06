import React from 'react';
import { Group, Header, Cell } from '@vkontakte/vkui';

const CodeError = () => {
  return (
    <Group header={<Header mode="secondary">Что-то пошло не так</Header>}>
      <Cell multiline={true}>
        По отсканированному коду ничего не нашлось.
      </Cell>
    </Group>
  );
};

export default CodeError;

import React from 'react';
import { Group, Header, List, SimpleCell as Cell } from '@vkontakte/vkui';

const StickersRules = () => {
  return (
    <Group header={<Header mode="secondary">Правила игры</Header>}>
      <List>
        <Cell multiline={true} disabled={true}>
          Стикерочки — игра, целью которой является угадывание слова,
          которое загадывает вам товарищ по игре.
        </Cell>
        <Cell multiline={true} disabled={true}>
          1&#41; После выбора вида игры каждый игрок придумывает слово для
          своего товарища по выбранной тематике;
        </Cell>
        <Cell multiline={true} disabled={true}>
          2&#41; Во время игры необходимо задавать вопросы, ответы на
          которые могут быть только &#171;Да&#187; или &#171;Нет&#187;.
          Например, вам загадали слово &#171;чайник&#187;. Первый вопрос
          звучит так: &#171;Я живое существо?&#187;, на что товарищи
          отвечают &#171;Нет&#187;. Если последовал ответ &#171;Нет&#187;,
          вопрос задает следующий игрок. Если же ответ &#171;Да&#187;,
          то ты можешь задать еще один вопрос, пока не отгадаешь слово
          или не услышишь &#171;Нет&#187;;
        </Cell>
        <Cell multiline={true} disabled={true}>
          3&#41; Игра заканчивается, когда все угадали загаданные им слова.
        </Cell>
      </List>
    </Group>
  );
};

export default StickersRules;

import React from 'react';
import { Group, Header, List, SimpleCell as Cell } from '@vkontakte/vkui';

const MafiaRules = () => {
  return (
    <Group header={<Header mode="secondary">Правила игры</Header>}>
      <List>
        <Cell multiline={true} disabled={true}>
          Правила находятся в разработке. Мы полностю роботизируем
          ведущего, благодаря чему большее количество людей сможет
          участвовать в игровом процессе.
        </Cell>
        {/* <Cell multiline={true} disabled={true}>
          1&#41; Перед стартом игроки делятся на команды по 2+ человека;
        </Cell>
        <Cell multiline={true} disabled={true}>
          2&#41; Выбирается игрок, который будем первым показывать слово,
          которое отобразится на экране. Остальные члены команды должны
          угадать максимальное количество слов за заданный в настройках
          промежуток времени.
        </Cell>
        <Cell multiline={true} disabled={true}>
          3&#41; Во время игры запрещается разговаривать и издавать
          какие-либо звуки, кроме выражения эмоций, произносить слова
          беззвучно, показывать отдельные буквы или указывать на
          окружающие вас предметы.
        </Cell>
        <Cell multiline={true} disabled={true}>
          4&#41; Во время игры разрешается двигать любой частью тела,
          принимать любые позы, отвечать на вопросы угадывающих жестами
          и разбивать словосочетания на отдельные слова.
        </Cell>
        <Cell multiline={true} disabled={true}>
          5&#41; Победителем считается команда, количество очков которой
          достигло заданного в настройках значения. Раунды проходят,
          пока победитель не определится.
        </Cell> */}
      </List>
    </Group>
  );
};

export default MafiaRules;

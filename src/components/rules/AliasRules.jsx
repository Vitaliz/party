import React from 'react';
import { Group, Header, List, SimpleCell as Cell } from '@vkontakte/vkui';

const AliasRules = () => {
  return (
    <Group header={<Header mode="secondary">Правила игры</Header>}>
      <List>
        <Cell multiline={true} disabled={true}>
          Алиас — командная игра, целью которой является объяснение слов.
        </Cell>
        <Cell multiline={true} disabled={true}>
          1&#41; Задачей каждого игрока команды является объяснение как можно
          большего количества слов, которые показываются на экране, своим
          товарищам по команде за заданный промежуток времени;
        </Cell>
        <Cell multiline={true} disabled={true}>
          2&#41; Во время объяснения нельзя использовать однокоренные слова,
          озвучивать перевод с иностранных языков и явно показывать жестами;
        </Cell>
        <Cell multiline={true} disabled={true}>
          3&#41; Отгаданное слово приноситкоманде одно очко, а за пропуск
          слова команда штрафуется &#40;данное правило можно включить или
          отключить в настройках&#41;;
        </Cell>
        <Cell multiline={true} disabled={true}>
          4&#41; Победителем считается команда, количество очков которой
          достигло заданного в настройках значения. Раунды проходят,
          пока победитель не определится.
        </Cell>
      </List>
    </Group>
  );
};

export default AliasRules;

import styled from 'styled-components/macro';

import { Button } from '@vkontakte/vkui';

const TeamButton = styled(Button).attrs((props) => ({
  size: 'l',
  mode: props.$unelevated ? 'tertiary' : 'overlay_primary'
}))`
  width: 100%;
  color: ${(props) => props.$unelevated ? '#fff' : '#FFA54F'};
`;

export default TeamButton;

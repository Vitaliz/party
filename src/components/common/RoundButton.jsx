import styled from 'styled-components/macro';

import { Button } from '@vkontakte/vkui';

const RoundButton = styled(Button).attrs({
  mode: 'overlay_primary'
})`
  border-radius: 999em;

  .Button__content {
    font-weight: 700;
  }
`;

export default RoundButton;

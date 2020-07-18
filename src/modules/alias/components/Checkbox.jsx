import styled from 'styled-components/macro';

import { Checkbox as NativeCheckbox } from '@vkontakte/vkui';

const Checkbox = styled(NativeCheckbox)`
  margin: 0 -16px;
  padding: 12px 16px;

  .Checkbox__content {
    color: #fff;
  }

  .Checkbox__icon {
    border-color: #fff;
  }

  .Checkbox__input:checked ~ .Checkbox__container .Checkbox__icon {
    background-color: #fff;
    border-color: #fff;
    color: #FFA54F;
  }

  @media (min-width: 432px) {
    &.Checkbox--ios {
      border-radius: 10px;
    }

    &.Checkbox--android {
      border-radius: 8px;
    }
  }
`;

export default Checkbox;

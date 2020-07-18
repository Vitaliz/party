import styled, { css } from 'styled-components/macro';

import { Button } from '@vkontakte/vkui';

const ButtonTheme = {
  yellow: css`background-color: #FFA54F;`
};

const ButtonOverlayTheme = {
  yellow: css`color: #FFA54F;`
};

const ButtonDisabledTheme = {
  yellow: css`${ButtonOverlayTheme.yellow} background-color: rgba(255, 165, 79, 0.2);`
};

const ThemedButtonBadge = css`
  &[disabled] {
    ${(props) => ButtonDisabledTheme[props.$color]}

    opacity: 1;

    .Button__content {
      font-weight: 500;
    }
  }
`;

const ThemedButton = styled(Button).attrs((props) => ({
  mode: props.$overlay && 'overlay_primary' || props.mode || 'primary',
  size: props.size || 'xl',
  disabled: props.$badge || props.disabled
}))`
  ${(props) => (props.$overlay ? ButtonOverlayTheme : ButtonTheme)[props.$color]}

  ${(props) => props.$badge && ThemedButtonBadge}

  .Icon {
    display: inline-block;
    vertical-align: bottom;
    width: 24px;
    height: 24px;
    margin: -2px 0 -2px 8px;
  }
`;

export default ThemedButton;

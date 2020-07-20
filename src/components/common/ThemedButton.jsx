import styled, { css } from 'styled-components/macro';

import { Button } from '@vkontakte/vkui';

const ButtonTheme = {
  yellow: css`background-color: #FFA54F;`,
  blue: css`background-color: #40BCFF;`,
  green: css`background-color: #28D984;`,
  gray: css`background-color: #616161;`
};

const ButtonOverlayTheme = {
  yellow: css`color: #FFA54F;`,
  blue: css`color: #40BCFF;`,
  green: css`color: #28D984;`,
  gray: css`color: #616161;`
};

const ButtonDisabledTheme = {
  yellow: css`${ButtonOverlayTheme.yellow} background-color: rgba(255, 165, 79, 0.2);`,
  blue: css`${ButtonOverlayTheme.blue} background-color: rgba(64, 188, 255, 0.2);`,
  green: css`${ButtonOverlayTheme.green} background-color: rgba(40, 217, 132, 0.2);`,
  gray: css`${ButtonOverlayTheme.gray} background-color: rgba(97, 97, 97, 0.2);`
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

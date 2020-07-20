import styled, { css } from 'styled-components/macro';

import { platform, ANDROID } from '@vkontakte/vkui';

const CounterTheme = {
  white: css`
    color: #fff;
    border-color: #fff;
  `,
  yellow: css`
    color: #FFA54F;
    border-color: #FFA54F;
  `
};

const AndroidBorder = css`
  border-radius: 8px;
`;

const iOSBorder = css`
  border-radius: 10px;
`;

const CounterBorder = platform() === ANDROID ?
  AndroidBorder : iOSBorder;

const Counter = styled.div`
  flex-shrink: 0;

  border: 1px solid;
  ${CounterBorder}
  ${(props) => CounterTheme[props.$color]}

  font-size: 26px;
  height: 32px;
  line-height: 32px;

  padding: 0 16px;
  box-sizing: border-box;
`;

export default Counter;

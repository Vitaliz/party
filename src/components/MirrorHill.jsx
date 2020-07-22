import React from 'react';
import styled from 'styled-components/macro';

import { Div, usePlatform } from '@vkontakte/vkui';
import { ReactComponent as HillFigure } from '../assets/hill.svg';

const MirrorHillContainer = styled.div`
  position: relative;

  margin-top: 140px;
  margin-bottom: 0;

  @media (min-width: 400px) {
    margin-top: 158px;
    margin-bottom: 18px;
  }

  @media (min-width: 450px) {
    margin-top: 176px;
    margin-bottom: 36px;
  }

  &.MirrorHillContainer--ios {
    margin-left: -12px;
    margin-right: -12px;
  }

  &.MirrorHillContainer--android {
    margin-left: -16px;
    margin-right: -16px;
  }

  @media (min-width: 432px) {
    &.MirrorHillContainer--ios {
      margin-left: calc(204px - 50vw);
      margin-right: calc(204px - 50vw);
    }

    &.MirrorHillContainer--android {
      margin-left: calc(202px - 50vw);
      margin-right: calc(202px - 50vw);
    }
  }

  @media (min-width: 482px) {
    &.MirrorHillContainer--ios,
    &.MirrorHillContainer--android {
      margin-left: calc(216px - 50vw);
      margin-right: calc(216px - 50vw);
    }
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    background-color: #fff;
    top: -36px;
    left: -50%;
    width: 200%;
    height: calc(100% - 64px);
  }
`;

const MirrorHillContent = styled(Div)`
  position: relative;
  z-index: 2;

  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  padding-top: 0;
  padding-bottom: 0;

  top: -64px;
  bottom: -64px;

  min-height: 72px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: stretch;
  align-items: stretch;

  @media (min-width: 482px) {
    padding: 0;
  }
`;

const MirrorHillFigure = styled.svg`
  display: block;
  position: absolute;

  left: 0;

  width: 100%;
  max-width: 748px;

  height: 136px;

  pointer-events: none;
  touch-action: none;
  user-select: none;

  fill: #fff;

  z-index: 1;
`;

const MirrorHillAffix = styled(MirrorHillFigure)`
  top: -128px;

  @media (min-width: 400px) {
    top: -146px;
  }

  @media (min-width: 450px) {
    top: -164px;
  }
`;

const MirrorHillPostfix = styled(MirrorHillFigure)`
  bottom: -128px;

  @media (min-width: 400px) {
    bottom: -146px;
  }

  @media (min-width: 450px) {
    bottom: -164px;
  }

  transform-origin: center 0;
  transform: rotate(180deg);
`;

const MirrorHill = (props) => {
  const platform = usePlatform();

  return (
    <MirrorHillContainer className={`MirrorHillContainer--${platform}`}>
      <MirrorHillAffix
        as={HillFigure}
      />
      <MirrorHillContent {...props} />
      <MirrorHillPostfix
        as={HillFigure}
      />
    </MirrorHillContainer>
  );
};

export default MirrorHill;

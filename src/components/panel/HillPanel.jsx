import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Panel, PanelHeaderSimple, PanelHeaderBack } from '@vkontakte/vkui';
import { ReactComponent as HillFigure } from '../../assets/hill.svg';

const HillTheme = {
  yellow: css`background-image: linear-gradient(100deg, #FFD44D 30%, #FFA24F 80%);`,
  blue: css`background-image: linear-gradient(100deg, #39DDFE 60%, #40BCFF 80%);`,
  green: css`background-image: linear-gradient(100deg, #38EDB1 40%, #28D984 80%);`
};

const HillPanelContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  min-height: 0;

  position: relative;
  z-index: 9;

  overflow: visible;

  background-color: #fff;

  margin-top: 128px;

  @media (min-width: 749px) {
    margin-top: 0;
  }
`;

const HillPanelContent = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;

  position: relative;
  top: -64px;
  padding: 0 16px;

  font-size: 16px;
  line-height: 26px;
  font-weight: 500;

  z-index: 1;

  @media (min-width: 450px) {
    top: -48px;
  }

  @media (min-width: 482px) {
    padding: 0;
  }

  @media (min-width: 749px) {
    top: 0;
  }
`;

const HillPanelAffix = styled.h1`
  position: relative;
  z-index: 9;

  color: #fff;
  background-color: transparent;

  font-size: 26px;
  line-height: 32px;

  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;

  padding: 20px 16px;

  @media (min-width: 482px) {
    padding: 20px 0;
  }
`;

const HillPanelPostfix = styled.div`
  background-color: #fff;

  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;

  padding: 20px 16px;

  @media (min-width: 482px) {
    padding: 20px 0;
  }
`;

const HillPanelGradient = styled.div`
  position: absolute;
  z-index: 7;

  top: 0;
  left: 0;
  right: 0;

  width: 100%;

  height: 2000px;
  transform: translateY(-1680px);
  will-change: transform;
  backface-visibility: hidden;

  pointer-events: none;
  touch-action: none;
  user-select: none;

  ${(props) => HillTheme[props.$color]}
`;

const HillPanelUnified = styled.div`
  &:after {
    background-color: transparent;
  }

  .Panel__in {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
  }
`;

const HillPanelHeader = styled.div`
  &,
  .PanelHeader__fixed {
    background-color: transparent;
  }

  .PanelHeader__left,
  .PanelHeader__content {
    color: #fff;
  }

  .PanelHeaderButton--android {
    &.Tappable--active {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .Tappable__wave {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const Hill = styled.svg`
  display: block;
  position: absolute;
  z-index: -1;

  width: 100%;
  max-width: 748px;

  height: 136px;

  left: 0;
  top: -128px;

  pointer-events: none;
  touch-action: none;
  user-select: none;

  fill: #fff;

  @media (min-width: 749px) {
    display: none;
  }
`;

const HillPanel = (props) => {
  return (
    <HillPanelUnified
      id={props.id}
      as={Panel}
      separator={false}
    >
      <HillPanelHeader
        as={PanelHeaderSimple}
        left={(
          <PanelHeaderBack onClick={props.callback} />
        )}
        separator={false}
      >
        {props.title}
      </HillPanelHeader>
      <HillPanelGradient $color={props.color} />
      <HillPanelAffix>
        {props.affix}
      </HillPanelAffix>
      <HillPanelContainer>
        <Hill as={HillFigure} />
        <HillPanelContent>
          {props.children}
        </HillPanelContent>
      </HillPanelContainer>
      <HillPanelPostfix>
        {props.postfix}
      </HillPanelPostfix>
    </HillPanelUnified>
  );
};

HillPanel.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  affix: PropTypes.node.isRequired,
  postfix: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue', 'green']).isRequired,
  callback: PropTypes.func.isRequired
};

export default HillPanel;

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Panel, PanelHeaderSimple } from '@vkontakte/vkui';
import { ReactComponent as HillFigure } from '../../assets/hill.svg';

const HillTheme = {
  yellow: css`background-image: linear-gradient(116deg, #FFD44D 4%, #FFA24F 68%);`,
  blue: css`background-image: linear-gradient(116deg, #39DDFE 4%, #40BCFF 68%);`,
  green: css`background-image: linear-gradient(140deg, #38EDB1 4%, #28D984 36%);`
};

const HillPanelContent = styled.div`
  position: relative;
  z-index: 9;

  background-color: #fff;
`;

const HillPanelAffix = styled.div`
  position: relative;
  z-index: 9;

  background-color: transparent;
`;

const HillPanelGradient = styled.div`
  position: absolute;
  z-index: 7;

  top: 0;
  left: 0;
  right: 0;

  width: 100%;

  height: 2000px;
  transform: translateY(-1800px);
  will-change: transform;
  backface-visibility: hidden;

  pointer-events: none;
  touch-action: none;
  user-select: none;

  ${(props) => HillTheme[props.color]}
`;

const HillPanelUnified = styled.div`
  &:after {
    background-color: transparent;
  }
`;

const HillPanelHeader = styled.div`
  &,
  .PanelHeader__fixed {
    background-color: transparent;
  }
`;

const Hill = styled.svg`
  display: block;
  position: absolute;
  z-index: -1;

  width: 100%;
  min-width: 748px;

  height: 136px;
  transform: translateX(-50%);

  pointer-events: none;
  touch-action: none;
  user-select: none;

  fill: #fff;
`;

const HillPanel = (props) => {
  return (
    <HillPanelUnified as={Panel} separator={false}>
      <HillPanelHeader as={PanelHeaderSimple} separator={false}>
        {props.title}
      </HillPanelHeader>
      <HillPanelGradient color={props.color} />
      <HillPanelAffix>
        {props.affix}
      </HillPanelAffix>
      <HillPanelContent>
        <Hill as={HillFigure} />
        {props.children}
      </HillPanelContent>
    </HillPanelUnified>
  );
};

HillPanel.propTypes = {
  title: PropTypes.node.isRequired,
  affix: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue', 'green']).isRequired
};

export default HillPanel;

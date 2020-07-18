import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Panel, PanelHeaderSimple, PanelHeaderBack, Div } from '@vkontakte/vkui';
import ThemedButton from '../common/ThemedButton';
import { ReactComponent as HillFigure } from '../../assets/hill.svg';
import IconUsers from '@vkontakte/icons/dist/36/users_3_outline';
import IconTime from '@vkontakte/icons/dist/28/recent_outline';

const HillTheme = {
  yellow: css`background-image: linear-gradient(100deg, #FFCC4E 30%, #FFA54F 80%);`,
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

const HillPanelContent = styled(Div)`
  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  position: relative;
  top: -64px;
  padding-top: 0;
  padding-bottom: 0;

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

const HillPanelAffix = styled(Div)`
  position: relative;
  z-index: 9;

  color: #fff;
  background-color: transparent;

  font-size: 26px;
  line-height: 32px;

  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  padding-top: 20px;
  padding-bottom: 20px;

  @media (min-width: 482px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const HillPanelPostfix = styled(Div)`
  background-color: #fff;

  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 482px) {
    padding-left: 0;
    padding-right: 0;
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

const HillPanelRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: stretch;

  margin-bottom: 12px;
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
          <PanelHeaderBack onClick={props.goBack} />
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
        <HillPanelRow>
          <ThemedButton
            $color={props.color}
            $badge={true}
            stretched={true}
          >
            {props.count}
            <IconUsers width={24} height={24} />
          </ThemedButton>
          <ThemedButton
            $color={props.color}
            $badge={true}
            stretched={true}
          >
            {props.time}
            <IconTime width={24} height={24} />
          </ThemedButton>
        </HillPanelRow>
        <ThemedButton
          $color={props.color}
          onClick={props.goForward}
        >
          {props.postfix}
        </ThemedButton>
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
  goForward: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  count: PropTypes.node.isRequired,
  time: PropTypes.node.isRequired
};

export default HillPanel;

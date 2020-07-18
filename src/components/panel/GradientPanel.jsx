import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Panel, PanelHeaderSimple, PanelHeaderBack, PanelHeaderClose, Div } from '@vkontakte/vkui';

const GradientTheme = {
  yellow: css`background-image: linear-gradient(170deg, #FFCC4E 4%, #FFA54F 96%);`,
  blue: css`background-image: linear-gradient(170deg, #39DDFE 4%, #40BCFF 96%);`
};

const GradientPanelUnified = styled.div`
  &:after {
    ${(props) => GradientTheme[props.$color]}
  }

  .Panel__in {
    background-color: transparent;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
  }
`;

const GradientPanelHeader = styled.div`
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

const GradientPanelContent = styled(Div)`
  position: relative;

  flex-shrink: 1;
  flex-grow: 1;
  min-height: 0;

  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 482px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const GradientPanelPostfix = styled(Div)`
  flex-shrink: 0;
  flex-grow: 0;

  width: 100%;
  max-width: 432px;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: 482px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const GradientPanel = (props) => {
  return (
    <GradientPanelUnified
      id={props.id}
      as={Panel}
      separator={false}
      $color={props.color}
    >
      <GradientPanelHeader
        as={PanelHeaderSimple}
        separator={false}
        left={(
          props.onBack && (<PanelHeaderBack onClick={props.onBack} />) ||
          props.onClose && (<PanelHeaderClose onClick={props.onClose} />)
        )}
      >
        {props.title}
      </GradientPanelHeader>
      <GradientPanelContent>
        {props.children}
      </GradientPanelContent>
      <GradientPanelPostfix>
        {props.postfix}
      </GradientPanelPostfix>
    </GradientPanelUnified>
  );
};

GradientPanel.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  postfix: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['yellow', 'blue']).isRequired,
  onBack: PropTypes.func,
  onClose: PropTypes.func
};

export default GradientPanel;

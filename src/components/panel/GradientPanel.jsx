import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

import { Panel, PanelHeaderSimple, PanelHeaderBack, PanelHeaderClose, Div } from '@vkontakte/vkui';

const GradientTheme = {
  yellow: css`
    background-image: linear-gradient(180deg, #FFCC4E 64px, #FFA54F 96%);
    background-image: linear-gradient(180deg, #FFCC4E calc(64px + var(--safe-area-inset-top, 0px)), #FFA54F 96%);
  `,
  blue: css`
    background-image: linear-gradient(180deg, #39DDFE 64px, #40BCFF 96%);
    background-image: linear-gradient(180deg, #39DDFE calc(64px + var(--safe-area-inset-top, 0px)), #40BCFF 96%);
  `
};

const GradientFillTheme = {
  yellow: css`background-color: #FFCC4E;`,
  blue: css`background-color: #39DDFE;`
};

const GradientPanelUnified = styled(Panel)`
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

  .Tappable--ios,
  .Tappable--android {
    &.Tappable--active:not([disabled]):not(.TabsItem):not(.PanelHeaderButton):not(.Button):not(.PanelHeaderContent__in):not(.ActionSheetItem):not(.Banner__in) {
      background: rgba(255, 255, 255, 0.3) !important;
    }

    .Tappable__wave {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

const GradientPanelHeader = styled(PanelHeaderSimple)`
  &,
  .PanelHeader__fixed {
    background-color: transparent;
  }

  .PanelHeader__fixed {
    ${(props) => GradientFillTheme[props.$color]}
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
      separator={false}
      $color={props.color}
    >
      <GradientPanelHeader
        separator={false}
        left={(
          props.onBack && (<PanelHeaderBack onClick={props.onBack} />) ||
          props.onClose && (<PanelHeaderClose onClick={props.onClose} />)
        )}
        $color={props.color}
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

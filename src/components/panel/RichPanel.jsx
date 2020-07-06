import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Panel, PanelHeaderSimple } from '@vkontakte/vkui';

import BACKGROUND_IMAGE from '../../assets/bg.png';

const RichPanelUnified = styled.div`
  &:after {
    background-image: url(${BACKGROUND_IMAGE});
    background-size: 100% auto;
    background-repeat: repeat-y;
  }

  .Panel__in {
    background-color: transparent;
  }
`;

const RichPanelHeader = styled.div`
  &,
  .PanelHeader__fixed {
    background-color: transparent;
  }
`;

const RichPanel = (props) => {
  return (
    <RichPanelUnified as={Panel} separator={false}>
      <RichPanelHeader as={PanelHeaderSimple} separator={false}>
        {props.title}
      </RichPanelHeader>
      {props.children}
    </RichPanelUnified>
  );
};

RichPanel.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default RichPanel;

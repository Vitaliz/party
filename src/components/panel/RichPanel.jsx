import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Panel, PanelHeaderSimple } from '@vkontakte/vkui';

const RichPanelUnified = styled.div`
  &:after {
    background-image: url(${require(/* webpackPreload: true */ '../../assets/bg.png')});
    background-size: 100% auto;
    background-repeat: repeat-y;
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

const RichPanelHeader = styled.div`
  &,
  .PanelHeader__fixed {
    background-color: transparent;
  }

  .PanelHeader__content {
    color: #fff;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
`;

const RichPanelFill = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;
  flex-basis: 0;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-content: stretch;
  align-items: stretch;

  padding: 16px;
`;

const RichPanelAffix = styled(RichPanelFill)`
  justify-content: flex-end;
`;

const RichPanelPostFix = styled(RichPanelFill)`
  justify-content: flex-start;
`;

const RichPanelContent = styled.div`
  flex-grow: 0;
  flex-shrink: 0;

  padding: 0 16px;
`;

const RichPanel = (props) => {
  return (
    <RichPanelUnified as={Panel} separator={false}>
      <RichPanelHeader as={PanelHeaderSimple} separator={false}>
        {props.title}
      </RichPanelHeader>
      <RichPanelAffix>
        {props.affix}
      </RichPanelAffix>
      <RichPanelContent>
        {props.children}
      </RichPanelContent>
      <RichPanelPostFix>
        {props.postfix}
      </RichPanelPostFix>
    </RichPanelUnified>
  );
};

RichPanel.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  affix: PropTypes.node.isRequired,
  postfix: PropTypes.node.isRequired
};

export default RichPanel;

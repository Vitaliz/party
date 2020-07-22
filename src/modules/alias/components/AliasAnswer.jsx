import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import IconCheck from '@vkontakte/icons/dist/16/check_circle';

const IconAnswer = styled(IconCheck).attrs(() => ({
  width: 24,
  height: 24
}))`
  color: #fff;
`;

const AliasAnswerUnified = styled.div`
  color: ${(props) => props.$success ? '#fff' : '#FFD8A7'};

  font-size: 20px;
  line-height: 24px;
  height: 24px;
  text-align: left;

  margin-bottom: 12px;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
`;

const AliasAnswer = (props) => {
  return (
    <AliasAnswerUnified
      $success={props.success}
    >
      {props.children}
      {
        props.success && (<IconAnswer />)
      }
    </AliasAnswerUnified>
  );
};

AliasAnswer.propTypes = {
  success: PropTypes.bool,
  children: PropTypes.node
};

export default AliasAnswer;

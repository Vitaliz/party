import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import Affix from '../../../components/common/Affix';

const AliasPostfixUnified = styled.div`
  color: #fff;
  text-align: center;

  flex-grow: 1;
  flex-shrink: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;

  padding-bottom: 56px;
`;

const AliasPostfixDescription = styled.div`
  color: #FFD8A7;

  font-size: 20px;
  line-height: 20px;
  font-weight: 500;

  margin-bottom: 12px;
`;

const AliasPostfix = (props) => {
  return (
    <AliasPostfixUnified>
      <AliasPostfixDescription>
        {props.description}
      </AliasPostfixDescription>
      <Affix>
        {props.children}
      </Affix>
    </AliasPostfixUnified>
  );
};

AliasPostfix.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired
};

export default AliasPostfix;

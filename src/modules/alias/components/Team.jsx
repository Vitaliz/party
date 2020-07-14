import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/macro';

import { Button as NativeButton, UsersStack } from '@vkontakte/vkui';

const Button = styled(NativeButton)`
  text-align: left;

  .Button__in {
    justify-content: flex-start;
  }
`;

const Team = (props) => {
  return (
    <Button
      size="l"
      mode="overlay_primary"
      after={(
        <UsersStack photos={props.avatars} />
      )}
      {...props}
    />
  );
};

Team.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.string)
};

export default Team;

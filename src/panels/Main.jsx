import React from 'react';
import PropTypes from 'prop-types';

import { HorizontalScroll } from '@vkontakte/vkui';

import RichPanel from '../components/panel/RichPanel';

const Main = ({ id }) => {
  return (
    <RichPanel id={id} title="partygame">
      Во что сыграем?
      <HorizontalScroll>
        <div>test</div>
      </HorizontalScroll>
    </RichPanel>
  );
};

Main.propTypes = {
  id: PropTypes.string.isRequired,
  callback: PropTypes.func.isRequired
};

export default Main;

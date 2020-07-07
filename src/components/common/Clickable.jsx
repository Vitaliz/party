import React from 'react';

import Tappable from 'react-tappable/lib/Tappable';

const Clickable = (props) => {
  /* eslint-disable react/prop-types */
  return (
    <Tappable
      stopPropagation={true}
      classBase="Clickable Clickable"
      pressDelay={2000}
      onTap={props.onClick}
      {...props}
    />
  );
};

Clickable.defaultProps = {
  component: 'div',
  role: 'button'
};

export default Clickable;

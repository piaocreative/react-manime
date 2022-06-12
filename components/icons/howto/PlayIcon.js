import React, { useState } from 'react';

const PlayIcon = props => {
  const [color, setColor] = useState('#fff');

  const hoverHandler = () => {
    setColor('#f7bfa0');
  };

  const leaveHandler = () => {
    setColor('#fff');
  }

  return (
    <svg width="72" height="72" viewBox="0 0 72 72" {...props} onMouseEnter={hoverHandler} onMouseLeave={leaveHandler}>
      <g fill="none" fillRule="evenodd" transform="translate(1 1)">
        <circle cx="35" cy="35" r="35" stroke={color || '#FFF'} strokeWidth="1.2"/>
        <path fill={color || '#FFF'} d="M27.759 20.517L27.759 49.483 49.483 35.305z"/>
      </g>
    </svg>
  );
}

export default PlayIcon;
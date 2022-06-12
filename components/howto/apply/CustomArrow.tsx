import React, { useState, useEffect } from 'react';

const CustomArrow = ({ className=undefined, style : styles=undefined, onClick=undefined, isLeft=undefined, disabled=false }) => {

  const left = isLeft ? '-16px': 'unset';
  const right = !isLeft ? '0px': 'unset';
  return (
    <div
      className={className}
      style={{ ...styles, display: "block",
        top: 'calc(100% + 12px)',
        left: left, //(isLeft && isDesktop) ? '-64px': isLeft ? '46px': 'unset',
        right: right, //(!isLeft && isDesktop) ? '-40px': !isLeft ?  '66px': 'unset',
        zIndex: 1,
      }}
      onClick={onClick}>
      <img
        onClick={onClick}
        style={{
          opacity: disabled && 0.25,
          cursor: 'pointer',
          marginTop: '-20px',
          position: 'relative',
          transform: isLeft && 'scaleX(-1)'
        }}
        src='/static/icons/arrow-right-long.svg' alt='arrow' />    
    </div>
  );
};

export default CustomArrow;
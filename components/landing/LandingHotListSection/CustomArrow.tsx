import React, { useState, useEffect } from 'react';

const CustomArrow = ({ className=undefined, style : styles=undefined, onClick=undefined, isLeft=undefined, disabled=undefined }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(true);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsDesktop(true);
    } else if(window.innerWidth > 360) {
      setIsSmallMobile(false);
    }
  }, []);

  const left = (isLeft && isDesktop) ? '-64px': (isLeft && isSmallMobile) ? '28px': isLeft ? '46px': 'unset';
  const right = (!isLeft && isDesktop) ? '-40px': (!isLeft && isSmallMobile) ? '48px': !isLeft? '66px': 'unset';
  return (
    <div
      className={className}
      style={{ ...styles, display: "block",
        top: !isDesktop && 'calc(100% + 16px)',
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
import React, { useState, useEffect } from 'react';

const CustomArrow = ({ className=undefined, style : styles=undefined, onClick=undefined, isLeft=undefined, disabled=undefined, props=undefined}) => {
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
  const top='calc(100% + 12px)';
  
  return (
    <button
      className={className}
      {...props}
      style={{ ...styles, display: "block",
        top: top,
        left: left,
        right: right,
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
    </button>
  );
};

export default CustomArrow;
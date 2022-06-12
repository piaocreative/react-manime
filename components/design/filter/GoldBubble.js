import React, { useState } from 'react';
import classNames from 'classnames';
import style from '../../../static/components/design/filter/color-bubble.module.css';

const GoldBubble = ({ selected, label, onClick }) => {
  const [hoverBorder, setHoverBorder] = useState('');
  const onEnter = () => {
    setHoverBorder('#2125297c');
  }

  const onToggle = () => {
    if (selected) {
      setHoverBorder('');
    }
    onClick();
  }

  return (
    <div>
      <svg
        className={style.bubbleIcon}
        xmlns="http://www.w3.org/2000/svg"
        width="36.492"
        height="52.934"
        viewBox="0 0 36.492 52.934"
        onClick={onToggle}
        onMouseEnter={onEnter}
        onMouseLeave={() => setHoverBorder('')}
        >
        <g transform="translate(0.751 1.031)">
          <defs>
            <linearGradient id="o98dw7jnya" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#EDBC6A"/>
              <stop offset="69.279%" stopColor="#F2E2C7"/>
              <stop offset="80.854%" stopColor="#F3E6D1"/>
              <stop offset="100%" stopColor="#ECBB67"/>
            </linearGradient>
          </defs>
          <path
            d="M28.4,21.062c-1.52-2.97-3.269-6.066-5.2-9.2-1.133-1.842-2.343-3.575-3.63-5.42L19.45,6.26c-.5-.721-1.017-1.458-1.536-2.22L15.16,0,11.509,5.347c-.519.756-1.009,1.469-1.488,2.2a86.6,86.6,0,0,0-8.273,14.7A19.721,19.721,0,0,0,0,29.206,15.5,15.5,0,0,0,14.708,44.987c.209.008.416.013.625.013h.153A15.57,15.57,0,0,0,30.737,30.578C31.065,26.863,29.809,23.808,28.4,21.062Z"
            transform="translate(2 4)"
            fill='url(#o98dw7jnya)'/>
          <path
            d="M17.44,50.853h0c-.235,0-.47-.005-.707-.015A17.619,17.619,0,0,1,0,32.912,21.648,21.648,0,0,1,1.91,25.188a88.723,88.723,0,0,1,8.5-15.13c.452-.689.914-1.365,1.4-2.074L17.265,0,21.7,6.5c.518.761,1.03,1.5,1.532,2.214l.131.189c1.3,1.865,2.533,3.629,3.71,5.541,1.974,3.209,3.76,6.371,5.308,9.4s2.938,6.421,2.561,10.668A17.668,17.668,0,0,1,17.61,50.852Z"
            transform="translate(0 0.3)"
            fill="none"
            stroke={selected ? '#2c4349' : (hoverBorder || 'transparent')}
            strokeMiterlimit="10"
            strokeWidth={selected ? 1.5 : 1} />
        </g>
      </svg>

      <div className={classNames(style.colorName, (selected || hoverBorder) && style.showLabel)}>{label}</div>
    </div>
  );
}

export default GoldBubble;
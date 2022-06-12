import React from 'react';

const CheckIcon = ({ color=undefined, size='', ...rest }) => (
  <svg width={size || "22.487"} height={size || "22.487"} viewBox="0 0 22.487 22.487" {...rest}>
    <g transform="translate(0.8 0.8)">
      <g>
        <path d="M20.887,10.444A10.444,10.444,0,1,1,10.444,0" transform="translate(0 0)" fill="none" stroke={color || "#f7bfa0"} strokeMiterlimit="10" strokeWidth="1.6"/>
        <path d="M0,5.924l4.525,4.993L15.749,0" transform="translate(4.98 2.983)" fill="none" stroke={color || "#f7bfa0"} strokeMiterlimit="10" strokeWidth="1.6"/>
      </g>
    </g>
  </svg>
);

export default CheckIcon;
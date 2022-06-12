import React from 'react';

const UncheckIcon = ({ color=undefined, size='', ...rest }) => (
  <svg width={size || "22.487"} height={size || "22.487"} viewBox="0 0 22.487 22.487" {...rest}>
    <g transform="translate(0.8 0.8)">
      <g>
        <path d="M20.887,10.444A10.444,10.444,0,1,1,10.444,0" transform="translate(0 0)" fill="none" stroke="#ff8282" strokeMiterlimit="10" strokeWidth="1.6"/>
        <path d="M0,9.656,9.928,0" transform="translate(5.842 5.616)" fill="none" stroke={color || "#ff8282"} strokeMiterlimit="10" strokeWidth="1.6"/>
        <path d="M9.928,9.656,0,0" transform="translate(5.842 5.616)" fill="none" stroke={color || "#ff8282"} strokeMiterlimit="10" strokeWidth="1.6"/>
      </g>
    </g>
  </svg>
);

export default UncheckIcon;
import React from 'react';

const CheckedIcon = ({ color, ...rest }) => (
  <svg width="14" height="14" viewBox="0 0 12 12" {...rest}>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(-1076 -424) translate(914 316) translate(17 98) translate(145 10)">
        <rect width="12" height="12" fill="#fff" opacity='0.4' rx="6"/>
        <path stroke={color || "#fff"} d="M3.148 6.56L5.389 8.474 9.031 3.474"/>
      </g>
    </g>
  </svg>

);

export default CheckedIcon;
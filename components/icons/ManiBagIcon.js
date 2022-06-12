import React from 'react';

const ManiBagIcon = ({ color="#f7bfa0", ...rest }) => (
  // <svg width="26" height="32" viewBox="0 0 22 27" {...rest}>
  //   <g fill="none" stroke={color || "#F7BFA0"} strokeWidth=".7">
  //       <path d="M.35 6.383v19.3h19.3v-19.3H.35z" transform="translate(1)"/>
  //       <path d="M6.167 9.013V4.668c0-2.21 1.79-4 4-4 2.209 0 4 1.79 4 4v3.516c-3.511.341-6.178-1.108-8-4.347" transform="translate(1)"/>
  //   </g>
  // </svg>
  <svg width="24" height="32" viewBox="0 0 29 35" {...rest}>
    <g id="BAG" transform="translate(0.5 0.5)">
      <path d="M18.667,0H28V29H0V0H9.526" transform="translate(0 5)" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="1"/>
      <path d="M0,8.942V4.5A5.061,5.061,0,0,1,4.5,0h0A5.061,5.061,0,0,1,9,4.5V8.942A9.546,9.546,0,0,1,0,3.771" transform="translate(9)" fill="none" stroke="#f7bfa0" strokeMiterlimit="10" strokeWidth="1"/>
    </g>
  </svg>
);

export default ManiBagIcon;
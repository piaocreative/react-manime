import React from 'react';

const AccountIcon = ({ color="#f7bfa0", ...rest }) => (
  <svg width="22" height="28" viewBox="0 0 20.7 23.35" {...rest}>
    <g transform="translate(0.35)">
      <g transform="translate(5)" fill="none" stroke={color} strokeMiterlimit="10" strokeWidth="0.7">
        <rect width="10" height="10.222" rx="5" stroke="none"/>
        <rect x="0.35" y="0.35" width="9.3" height="9.522" rx="4.65" fill="none"/>
      </g>
      <path data-name="Oval 3" d="M3.9,2.281C9.1,9.012,20,10.49,20,10.08,20,5.417,15.523,0,10,0A10.04,10.04,0,0,0,0,10.08c0,.528,6.491-.418,10-2.867" transform="translate(0 12.778)" fill="none" stroke={color || "#f7bfa0"} strokeMiterlimit="10" strokeWidth="0.7"/>
    </g>
  </svg>
);

export default AccountIcon;
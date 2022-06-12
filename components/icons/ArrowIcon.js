import React from 'react';

const ArrowIcon = ({ color=undefined, ...rest }) => (
  <svg width="12" height="7" viewBox="0 0 10.356 5.921" {...rest}>
    <path fill={color || '#fff'} d="M11.367,15.383l3.916-3.919a.737.737,0,0,1,1.045,0,.746.746,0,0,1,0,1.048l-4.437,4.44a.739.739,0,0,1-1.021.022L6.4,12.515a.74.74,0,0,1,1.045-1.048Z" transform="translate(-6.188 -11.246)"/>
  </svg>

);

export default ArrowIcon;
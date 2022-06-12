import React from 'react';

const MediaPlayIcon = ({ color='', ...rest }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" {...rest}>
    <g fill="none" fillRule="evenodd">
      <g>
        <g transform="translate(-239 -175) translate(124 167) translate(115 8)">
          <circle cx="6.5" cy="6.5" r="6.5" fill={color || "#2C4349"} />
          <path fill="#FFF" d="M4.5 3L4.5 9.757 10 6.379z"/>
        </g>
      </g>
    </g>
  </svg>
);

export default MediaPlayIcon;
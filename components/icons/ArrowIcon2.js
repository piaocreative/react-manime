import React from 'react';

const ArrowIcon = ({ color, ...rest }) => (
  <svg width="15" height="12" viewBox="0 0 9 8" {...rest}>
    <g fill="none" fillRule="evenodd">
        <g stroke={color || "#2C4349"} strokeWidth=".8">
            <g>
                <g>
                    <path strokeLinecap="square" d="M0 3.216h5.687" transform="translate(-249 -594) translate(118 591) translate(132 4)"/>
                    <path d="M6.527 0L3.287 3.216 6.527 6.456" transform="translate(-249 -594) translate(118 591) translate(132 4) matrix(-1 0 0 1 9.814 0)"/>
                </g>
            </g>
        </g>
    </g>
</svg>

);

export default ArrowIcon;
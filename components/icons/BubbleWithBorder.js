import React from 'react';

const Bubble = ({ border=undefined, borderWidth=undefined, color=undefined, ...rest }) => (
  <svg width="17" height="22" viewBox="0 0 17 22" {...rest}>
    <path fill={color || "#FFF"} fillOpacity={color ? "1": ".5"} fillRule="evenodd" stroke={border || "#FFF"} d="M14.591 9.96c-.719-1.405-1.546-2.869-2.459-4.353-.536-.87-1.108-1.69-1.716-2.562l-.059-.085c-.238-.34-.48-.69-.726-1.05L8.33 0 6.603 2.529c-.246.357-.477.694-.704 1.04-1.544 2.35-2.904 4.495-3.912 6.952-.395.962-.802 2.106-.826 3.29-.079 3.954 3.04 7.302 6.954 7.463.1.004.197.006.296.006h.072c3.77-.036 6.871-2.968 7.212-6.82.156-1.757-.439-3.201-1.104-4.5" opacity={color? "1": ".71"}/>
  </svg>
);

export default Bubble;
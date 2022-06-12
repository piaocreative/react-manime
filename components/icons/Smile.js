import React from 'react';

const Smile = ({ color=undefined, ...rest }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" {...rest}>
    <g fill={color || "#FEFEFE"} fillRule="evenodd" stroke="#FFF" strokeWidth=".66">
      <path d="M14.304.55C6.72.55.55 6.72.55 14.304c0 7.585 6.17 13.756 13.754 13.756 7.585 0 13.755-6.171 13.755-13.756C28.059 6.72 21.889.55 14.304.55m0 28.06C6.417 28.61 0 22.192 0 14.304 0 6.417 6.417 0 14.304 0 22.191 0 28.61 6.417 28.61 14.304c0 7.888-6.418 14.306-14.305 14.306" transform="translate(1 1)"/>
      <path d="M10.671 14.018c-.128.607-.51 1.104-1.05 1.368-.968.475-2.176.05-2.692-.945-.154-.3-.213-.659-.25-.972-.015-.132-.026-.273-.037-.44.69.425 2.262 1.082 4.03.989m-.14-1.333c.127.292.19.6.187.915-1.933.122-3.755-.767-4.096-1.08-.005-.562.034-1.134.074-1.67.01-.135.022-.268.037-.43l.037-.397.14.075c.142.075.282.145.428.221.306.158.597.307.886.477.497.292.967.593 1.398.894.355.247.71.54.91.995M9.86 11.35c-.438-.306-.917-.612-1.424-.91-.3-.176-.598-.33-.917-.494l-.032-.016-.382-.198-.69-.365-.094 1.03c-.014.146-.027.283-.036.422-.07.947-.12 1.803-.016 2.698.04.35.108.756.293 1.114.618 1.194 2.072 1.7 3.241 1.127.03-.015.06-.029.087-.045l.022-.012c1.096-.608 1.525-1.976 1-3.18-.24-.55-.648-.888-1.052-1.171M18.406 9.818c-.13.608-.51 1.105-1.05 1.369-.969.475-2.177.05-2.691-.945-.156-.3-.214-.659-.25-.973-.017-.132-.028-.272-.038-.438.689.424 2.26 1.08 4.029.987m-.139-1.332c.128.292.19.6.186.914-1.933.122-3.754-.766-4.095-1.08-.005-.56.034-1.133.073-1.67.01-.134.022-.267.038-.43l.036-.397.14.076.429.221c.307.157.597.306.885.476.499.293.967.593 1.398.895.356.247.71.54.91.995m-.672-1.335c-.439-.306-.917-.612-1.425-.91-.299-.176-.598-.33-.917-.494l-.032-.016-.382-.198-.69-.365-.094 1.03c-.014.145-.026.283-.036.422-.07.947-.12 1.802-.016 2.698.041.35.108.756.294 1.114.617 1.194 2.071 1.7 3.24 1.127.03-.016.06-.029.089-.046.006-.003.014-.007.02-.012 1.096-.607 1.525-1.975 1-3.18-.24-.55-.646-.887-1.051-1.17M18.434 21.957c-3.919 2.127-8.836.67-10.964-3.247l.484-.262c1.981 3.65 6.566 5.01 10.218 3.027 3.652-1.983 5.01-6.567 3.027-10.22l.483-.262c2.127 3.92.67 8.837-3.248 10.964" transform="translate(1 1)"/>
    </g>
  </svg>
);

export default Smile;
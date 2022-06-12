import React from 'react';

const GiftIcon = ({ color=undefined, ...rest }) => (
  <svg width="18" height="24" viewBox="0 0 18 24" {...rest}>
    <g fill="none" fillRule="evenodd">
      <g>
        <g stroke="#F5BFA0">
            <path d="M7.709 3.07c-.142.516-.269 1.073-.38 1.654-.065.34-.109.677-.156 1.035l-.004.035c-.019.14-.037.283-.058.43L7 7l1.01-.241c.144-.034.28-.066.415-.101.924-.238 1.756-.467 2.57-.854.32-.151.683-.346.96-.638.924-.975.908-2.528-.036-3.461-.024-.024-.048-.047-.073-.069l-.018-.016c-.953-.852-2.4-.823-3.367.067-.44.406-.622.905-.752 1.383" transform="translate(-89 -297) translate(90 297) translate(1.028 .363) rotate(-8 9.819 4)"/>
            <path d="M1.971 3.07c-.14.516-.268 1.073-.38 1.654-.064.34-.108.677-.155 1.035l-.005.035c-.018.14-.037.283-.058.43L1.263 7l1.01-.241c.144-.034.279-.066.415-.101.924-.238 1.755-.467 2.57-.854.319-.151.682-.346.96-.638.923-.975.907-2.528-.037-3.461l-.072-.069-.019-.016c-.953-.852-2.4-.823-3.366.067-.441.406-.623.905-.753 1.383" transform="translate(-89 -297) translate(90 297) translate(1.028 .363) scale(-1 1) rotate(-8 0 62.364)"/>
        </g>
        <path stroke="#F5BFA0" d="M15.917 6.138L7.963 8.326" transform="translate(-89 -297) translate(90 297) rotate(-1 11.94 7.232)"/>
        <path stroke="#F5BFA0" d="M0.313 6.002L7.962 8.342" transform="translate(-89 -297) translate(90 297) rotate(-1 4.138 7.172)"/>
        <path stroke="#2C4349" d="M0.088 17.928L0.088 8.335 15.897 8.335 15.897 17.928 15.897 20.477 15.897 23.335 7.106 23.335 0.088 23.335z" transform="translate(-89 -297) translate(90 297)"/>
        <path stroke="#F5BFA0" strokeLinecap="square" d="M7.983 9.322L8 22.342" transform="translate(-89 -297) translate(90 297)"/>
        <path stroke="#F5BFA0" strokeLinecap="square" d="M7.978 8.932L7.996 22.732" transform="translate(-89 -297) translate(90 297) rotate(-89.925 7.987 15.832)"/>
      </g>
    </g>
  </svg>
);

export default GiftIcon;
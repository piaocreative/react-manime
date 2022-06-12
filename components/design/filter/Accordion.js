import React from 'react';
// import classNames from 'classnames';
import style from '../../../static/components/design/filter/accordion.module.css';

const Accordion = ({ title, children, opened=true, isFirst }) => {
  return (
    <div className={isFirst ? '': style.container}>
      <div className={style.header}>
        {title}
      </div>
      <div className={style.childContainer}>
        {opened && children}
      </div>
    </div>
  );
}

export default Accordion;
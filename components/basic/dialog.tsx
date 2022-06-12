import React from 'react';

import style from '../../static/components/basic/dialog.module.css';

const DialogWrapper = ({ onClose, children }) => {

  const onCloseHandler = () => {
    onClose && onClose();
  }

  return (
    <>
    <div className={style.container}>
      {children}
    </div>
    <div className={style.overlay} onClick={onCloseHandler} />
    </>
  );
};

export default DialogWrapper;
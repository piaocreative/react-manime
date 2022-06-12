import React from 'react';
import { DarkButton } from '../../../basic/buttons';
import style from './css/input-email.module.css';

export default function CaptureSuccess({ onClose, 
  header="You're on the list", 
  copy="Your future looks shiny! We'll let you know the second these brand new glitter manis arrive!" ,
  primaryColor=undefined, secondaryColor=undefined}){ 

  return (
    <div className={style.container}>
      <div className={style.title}>{header}</div>
      <div className={style.successDescription}>
        {copy}
      </div>
      <DarkButton passedClass={style.joinButton} onClick={onClose} style={{backgroundColor: primaryColor, color: secondaryColor}}>
        KEEP EXPLORING
      </DarkButton>
    </div>
  );
};


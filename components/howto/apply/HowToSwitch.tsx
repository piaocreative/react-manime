import React from 'react';
import Router from 'next/router';
import { OutlinedDarkButton, DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/howto/apply/howto-switch.module.css';

const HowToSwitch = ({ isWork }) => {
  const onApplyHanlder = () => {
    Router.push(pageLinks.HowToApply.url);
  };

  const onWorkHanlder = () => {
    Router.push(pageLinks.HowItWorks.url);
  };

  return (
    <div className={style.container}>
    {isWork ?
      <>
        <DarkButton passedClass={style.actionButton} onClick={onWorkHanlder}>HOW IT WORKS</DarkButton>
        <OutlinedDarkButton passedClass={style.actionButton} onClick={onApplyHanlder}>HOW TO APPLY</OutlinedDarkButton>
      </>:
      <>
        <OutlinedDarkButton passedClass={style.actionButton} onClick={onWorkHanlder}>HOW IT WORKS</OutlinedDarkButton>
        <DarkButton passedClass={style.actionButton} onClick={onApplyHanlder}>HOW TO APPLY</DarkButton>
      </>
    }
    </div>
  );

};

export default HowToSwitch;
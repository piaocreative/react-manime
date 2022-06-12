import React from 'react';
import style from '@styles/gift/group/styles.module.css';

export default function HeaderBox(props) {
  return (
    <div className={style.stepsHeader} style={{ backgroundColor: '#fbf7f4',  }}>
      <div
        className={`${style.smallDropContainer} ${props.step === 'shop' && style.active}`}

      >
        <img
          className={style.drop}
          src={
            props.step === 'shop'
              ? '/static/icons/water-drop-dark.svg'
              : '/static/icons/water-drop-grey.svg'
          }
        />
        <div className={style.dropText}>1</div>
        Gift Kit
      </div>
      <img
        className={`${style.arrow} ${props.step === 'shop' && style.active}`}
        style={{
          transform: 'rotate(180deg',
        }}
        src="/static/icons/arrow-left-nocircle.svg"
      ></img>
      <div
        className={`${style.smallDropContainer} ${props.step === 'guests' && style.active}`}
      >
        <img
          className={style.drop}
          src={
            props.step === 'guests' || props.step === 'message'
              ? '/static/icons/water-drop-dark.svg'
              : '/static/icons/water-drop-grey.svg'
          }
        />
        <div className={style.dropText}>2</div>
        Recipients
      </div>
      <img
        className={`${style.arrow} ${(props.step === 'guests' || props.step === 'message') && style.active}`}
        style={{

          transform: 'rotate(180deg',
        }}
        src="/static/icons/arrow-left-nocircle.svg"
      ></img>
      <div
        className={`${style.smallDropContainer} ${props.step === 'payment' && style.active}`} >
        <img
          className={style.drop}
          src={
            props.step === 'payment'
              ? '/static/icons/water-drop-dark.svg'
              : '/static/icons/water-drop-grey.svg'
          }
        />
        <div className={style.dropText}>3</div>
        Payment
      </div>
    </div>
  );
}

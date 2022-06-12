import React, { useState, useEffect, useRef } from 'react';

import { DarkButton } from '../../basic/buttons';
import Slider from 'rc-slider';
import { fingers } from '../../../constants';
import { fingerNames, toeNames } from '../../../constants';
import { start } from '../../nail-canvas/refitMain';

import style from './css/adjust-width-dialog.module.css';

const MULTIPLIER = 4;

const AdjustWidthDialog = ({ state, setState, selectedIndex, onClose }) => {
  const [baseWidth, setBaseWidth] = useState(0);
  const [tipWidth, setTipWidth] = useState(0);
  const [length, setLength] = useState(0);
  const [comment, setComment]  = useState('');
  const lengthRef = useRef();
  const tipWidthRef = useRef();
  const baseWidthRef = useRef();

  const lowerWidthChangeHandler = ev => {
    setBaseWidth(ev.target.value * 4);
  };

  const upperWidthChangehandler = ev => {
    setTipWidth(ev.target.value * 4);
  };

  const lengthChangeHandler = ev => {
    setLength(ev.target.value);
  };

  useEffect(() => {
    start();

    setComment(state[`f${selectedIndex % 10}Comment`] || '');
    setTimeout(() => {
      sliderTipWidthChangeHandler((state[`f${selectedIndex % 10}TipWidth`] || 0) / MULTIPLIER);
      sliderBaseWidthChangeHandler((state[`f${selectedIndex % 10}BaseWidth`] || 0) / MULTIPLIER);
    }, 100);
    
  }, []);

  const clickDoneHandler = () => {
    const baseWidthValue = baseWidth * MULTIPLIER;
    const tipWidthValue = tipWidth * MULTIPLIER;

    if (selectedIndex === 10) {
      setState(prevState => ({...prevState,
        [`f0BaseWidth`]: baseWidthValue,
        [`f1BaseWidth`]: baseWidthValue,
        [`f2BaseWidth`]: baseWidthValue,
        [`f3BaseWidth`]: baseWidthValue,
        [`f4BaseWidth`]: baseWidthValue,
        [`f5BaseWidth`]: baseWidthValue,
        [`f6BaseWidth`]: baseWidthValue,
        [`f7BaseWidth`]: baseWidthValue,
        [`f8BaseWidth`]: baseWidthValue,
        [`f9BaseWidth`]: baseWidthValue,

        [`f0TipWidth`]: tipWidthValue,
        [`f1TipWidth`]: tipWidthValue,
        [`f2TipWidth`]: tipWidthValue,
        [`f3TipWidth`]: tipWidthValue,
        [`f4TipWidth`]: tipWidthValue,
        [`f5TipWidth`]: tipWidthValue,
        [`f6TipWidth`]: tipWidthValue,
        [`f7TipWidth`]: tipWidthValue,
        [`f8TipWidth`]: tipWidthValue,
        [`f9TipWidth`]: tipWidthValue,

        [`f0Comment`]: comment,
        [`f1Comment`]: comment,
        [`f2Comment`]: comment,
        [`f3Comment`]: comment,
        [`f4Comment`]: comment,
        [`f5Comment`]: comment,
        [`f6Comment`]: comment,
        [`f7Comment`]: comment,
        [`f8Comment`]: comment,
        [`f9Comment`]: comment,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        [`f${selectedIndex}BaseWidth`]: baseWidthValue,
        [`f${selectedIndex}TipWidth`]: tipWidthValue,
        [`f${selectedIndex}Comment`]: comment,
      }));
    }
    onClose && onClose();
  };

  const sliderTipWidthChangeHandler = (value) => {
    setTipWidth(value);
    tipWidthRef.current.onchange(value);
  };

  const sliderBaseWidthChangeHandler = (value) => {
    setBaseWidth(value);
    baseWidthRef.current.onchange(value);
  };

  const tipWiderHandler = () => {
    if (tipWidth + 1 <= 25)
      sliderTipWidthChangeHandler(tipWidth + 1);
  };

  const tipShorterHandler = () => {
    if (tipWidth - 1 >= -25)
      sliderTipWidthChangeHandler(tipWidth - 1);
  };

  const baseWiderHandler = () => {
    if (baseWidth + 1 <= 25)
      sliderBaseWidthChangeHandler(baseWidth + 1);
  };

  const baseShorterHandler = () => {
    if (baseWidth - 1 >= -25)
      sliderBaseWidthChangeHandler(baseWidth - 1);
  };

  const isManis = state.profileType === 'Manis';

  return (
    <div className={style.container}>
      {onClose &&
        <img
          className={style.closeButton}
          src='/static/icons/close-dark-icon.svg'
          onClick={onClose}
          alt='close' />
      }
      <div className={style.title}>
        {selectedIndex === 10 ?
          <>ADJUST THE WIDTH <br />OF ALL NAILS</>:
          `ADJUST THE ${isManis? fingerNames[selectedIndex]: toeNames[selectedIndex]} WIDTH`
        }
      </div>
      <div className={style.description}>
        Use the + and - button to make <br /> your gels wider or narrower
      </div>
      <div className={style.labelBar}>
        <div className={style.actionLabel}>Narrower</div>
        <div className={style.actionLabel}>Current</div>
        <div className={style.actionLabel}>Wider</div>
      </div>
      <div className={style.controlPanel}>
        <div className={style.controlBar}>
          <div className={style.circularAction} onClick={tipShorterHandler}>
            –
          </div>
          {tipWidth ? <div className={style.startLine} />: null}
          <Slider
            defaultValue={0}
            value={tipWidth}
            onChange={sliderTipWidthChangeHandler}
            min={-25}
            max={25}
            startPoint={0}
            railStyle={{height: 10, background: '#fff', borderRadius: 0, marginTop: -3}}
            trackStyle={{height: 10, background: '#f7bfa0', borderRadius: 0, marginTop: -3}}
            handleStyle={{
              background: 'url(/static/images/refit/handler2.svg)',
              width: 25,
              height: 33,
              marginTop: -14,
              backgroundRepeat: 'no-repeat',
              transform: 'translate(-50%, 50%) rotate(90deg)',
              border: 'none',
              boxShadow: 'none'
            }}
          />
          <div className={style.circularAction} onClick={tipWiderHandler}>
            +
          </div>
        </div>
        <div className={style.arrowLabelBar}>
          <img className={style.arrowLeft} src='/static/icons/arrow-orange-long.svg' alt='arr-left' />
          <span className={style.arrowLabel}>TIP WIDTH</span>
          <img className={style.arrowRight} src='/static/icons/arrow-orange-long.svg' alt='arr-right' />
        </div>
        <canvas id='interactiveNailCanvas' width={180} height={200}></canvas>
        <div className={style.arrowLabelBar}>
          <img className={style.arrowLeft} src='/static/icons/arrow-orange-long.svg' alt='arr-left' />
          <span className={style.arrowLabel}>BASE WIDTH</span>
          <img className={style.arrowRight} src='/static/icons/arrow-orange-long.svg' alt='arr-right' />
        </div>
        <div className={style.controlBar}>
          <div className={style.circularAction} onClick={baseShorterHandler}>
            –
          </div>
          {baseWidth ? <div className={style.startLine} />: null}
          <Slider
            defaultValue={0}
            value={baseWidth}
            onChange={sliderBaseWidthChangeHandler}
            min={-25}
            max={25}
            startPoint={0}
            railStyle={{height: 10, background: '#fff', borderRadius: 0, marginTop: -3}}
            trackStyle={{height: 10, background: '#f7bfa0', borderRadius: 0, marginTop: -3}}
            handleStyle={{
              background: 'url(/static/images/refit/handler2.svg)',
              width: 25,
              height: 33,
              marginTop: -14,
              backgroundRepeat: 'no-repeat',
              transform: 'translate(-50%, 50%) rotate(90deg)',
              border: 'none',
              boxShadow: 'none'
            }}
          />
          <div className={style.circularAction} onClick={baseWiderHandler}>
            +
          </div>
        </div>
        <div className={style.labelBar}>
          <div className={style.actionLabel}>Narrower</div>
          <div className={style.actionLabel}>Current</div>
          <div className={style.actionLabel}>Wider</div>
        </div>

      </div>
      <textarea
        className={style.commentArea}
        placeholder='Example: It’s a tiny bit too wide at the tip'
        value={comment}
        onChange={ev => setComment(ev.target.value)} />
      <div style={{display: 'none'}}>
        <input ref={lengthRef} type='range' min='-25' max='25' value={length} className='slider' id='lengthSlider' onChange={lengthChangeHandler} />
        <input ref={baseWidthRef} type='range' min='-25' max='25' value={baseWidth} className='slider' id='lowerWidthSlider' onChange={lowerWidthChangeHandler} />
        <input ref={tipWidthRef} type='range' min='-25' max='25' value={tipWidth} className='slider' id='upperWidthSlider' onChange={upperWidthChangehandler} />
        <button type='button' id='resetButton'>
          Reset
        </button>
      </div>
      <DarkButton
        passedClass={style.actionButton}
        onClick={clickDoneHandler}>
        DONE
      </DarkButton>
    </div>
  );
};

export default AdjustWidthDialog;
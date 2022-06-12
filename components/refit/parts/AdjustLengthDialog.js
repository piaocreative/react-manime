import React, { useState, useEffect, useRef } from 'react';

import { DarkButton } from '../../basic/buttons';
import Slider from 'rc-slider';
import { fingerNames, toeNames } from '../../../constants';
import { start } from '../../nail-canvas/refitMain';


import style from './css/adjust-length-dialog.module.css';

const MULTIPLIER = 4;

const AdjustLengthDialog = ({ state, setState, selectedIndex, onClose }) => {
  const [lowerWidth, setLowerWidth] = useState(0);
  const [upperWidth, setUpperWidth] = useState(0);
  const [length, setLength] = useState(0);
  const lengthRef = useRef();

  const lowerWidthChangeHandler = ev => {
    setLowerWidth(ev.target.value);
  };

  const upperWidthChangehandler = ev => {
    setUpperWidth(ev.target.value);
  };

  const lengthChangeHandler = ev => {
    setLength(ev.target.value);
  };

  useEffect(() => {
    start();
    
    setTimeout(() => {
      sliderLengthChangeHandler((state[`f${selectedIndex % 10}Length`] || 0) / MULTIPLIER);
    }, 100);
    
  }, []);

  const clickDoneHandler = () => {
    const lengthValue = length * MULTIPLIER;
    if (selectedIndex === 10) {
      setState(prevState => ({...prevState,
        [`f0Length`]: lengthValue,
        [`f1Length`]: lengthValue,
        [`f2Length`]: lengthValue,
        [`f3Length`]: lengthValue,
        [`f4Length`]: lengthValue,
        [`f5Length`]: lengthValue,
        [`f6Length`]: lengthValue,
        [`f7Length`]: lengthValue,
        [`f8Length`]: lengthValue,
        [`f9Length`]: lengthValue,
      }));
    } else {
      setState(prevState => ({...prevState, [`f${selectedIndex}Length`]: lengthValue}));
    }
    onClose && onClose();
  };

  const sliderLengthChangeHandler = (value) => {
    setLength(value);
    lengthRef.current.onchange(value);
  };

  const longerHandler = () => {
    if (length + 1 <= 25)
      sliderLengthChangeHandler(length + 1);
  };

  const shorterHandler = () => {
    if (length - 1 >= -25)
      sliderLengthChangeHandler(length - 1);
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
          <>ADJUST THE LENGTH <br />OF ALL NAILS</>:
          `ADJUST THE ${isManis? fingerNames[selectedIndex]: toeNames[selectedIndex]} LENGTH`
        }
      </div>
      <div className={style.description}>
        Use the + and - button to make <br /> your gels longer or shorter
      </div>
      <div className={style.controlPanel}>
        <canvas id='interactiveNailCanvas' width={160} height={240}></canvas>
        <div className={style.controlBar}>
          <div className={style.actionLabel}>Longer</div>
          <div className={style.circularAction} onClick={longerHandler}>
            +
          </div>
          {length ? <div className={style.startLine}></div>: null}
          <Slider
            defaultValue={0}
            value={length}
            onChange={sliderLengthChangeHandler}
            min={-25}
            max={25}
            startPoint={0}
            vertical={true}
            railStyle={{width: 10, background: '#fff', borderRadius: 0, marginLeft: -3}}
            trackStyle={{width: 10, background: '#f7bfa0', borderRadius: 0, marginLeft: -3}}
            handleStyle={{
              background: 'url(/static/images/refit/handler.svg)',
              width: 32,
              height: 25,
              marginLeft: -14,
              backgroundRepeat: 'no-repeat',
              border: 'none',
              boxShadow: 'none'
            }}
          />
          <div className={style.circularAction} onClick={shorterHandler}>
            –
          </div>
          <div className={style.actionLabel}>Shorter</div>
        </div>
        <div className={style.actionLabel}>
          Current <br />size
        </div>
      </div>
      <div style={{display: 'none'}}>
        <div>
          <p> Change Nail Length</p>
          <input ref={lengthRef} type='range' min='-25' max='25' value={length} className='slider' id='lengthSlider' onChange={lengthChangeHandler} />
        </div>
        <div>
          <p> Change Lower Nail Width</p>
          <input type='range' min='-25' max='25' value={lowerWidth} className='slider' id='lowerWidthSlider' onChange={lowerWidthChangeHandler} />
        </div>
        <div>
          <p> Change Upper Nail Width</p>
          <input type='range' min='-25' max='25' value={upperWidth} className='slider' id='upperWidthSlider' onChange={upperWidthChangehandler} />
        </div>
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

export default AdjustLengthDialog;
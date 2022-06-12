import React from 'react';
import Rating from 'react-rating';

import BubbleWithBorder from '../../icons/BubbleWithBorder';

import style from './css/bubble-rating.module.css';

const BubbleRating = ({ ratingValue, onChange, ...props }) => {
  return (
    <div>
      <div className={style.labelLine}>
        <div>Size is <br />off</div>
        <div>Size is <br />perfect</div>
      </div>
      <Rating {...props}
        fractions={2}
        initialRating={ratingValue || 0}
        onChange={onChange}
        emptySymbol={
          <BubbleWithBorder
            className={style.symbol}
            border='#F7BFA0'
            color='transparent'
          />
        }
        fullSymbol={
          <BubbleWithBorder
            className={style.symbol}
            border='#F7BFA0'
            color='#F7BFA0' />
        }
      />
    </div>
  );
};

export default BubbleRating;
import React from 'react';
import classNames from 'classnames';
import style from '../../static/components/basic/buttons.module.css';

export const OutlinedButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.outlinedButton, passedClass, {
    [style.smallHeightButton]: isSmall
  })} {...rest}>
    {children}
  </button>
);

export const OutlinedDarkButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.whiteGlow, style.outlinedDarkButton, passedClass, {
    [style.smallHeightButton]: isSmall
  })} {...rest}>
    {children}
  </button>
);

export const GrayButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.grayButton, passedClass, {
    [style.smallHeightButton]: isSmall
  })} {...rest}>
    {children}
  </button>
);

export const PrimaryButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.primaryButton, passedClass, {
    [style.smallHeightButton]: isSmall,

  })} {...rest}>
    {children}
  </button>
);

export const WhiteButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.whiteGlow, style.whiteButton, passedClass, {
    [style.smallHeightButton]: isSmall,

  })} {...rest}>
    {children}
  </button>
);

export const DarkButton = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.darkButton, passedClass, {
    [style.smallHeightButton]: isSmall
  })} {...rest}>
    {children}
  </button>
);

export const DarkButton2 = ({children, passedClass=undefined, isSmall=false, ...rest}) => (
  <button className={classNames(style.glow, style.darkButton2, passedClass, {
    [style.smallHeightButton]: isSmall
  })} {...rest}>
    {children}
  </button>
);

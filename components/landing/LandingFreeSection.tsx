import React from 'react';
import classNames from 'classnames';
import style from '../../static/components/landing/landing-free-section.module.css';

const circleLogo1 = '/static/icons/circle-logo01.svg';
const circleLogo2 = '/static/icons/circle-logo02.svg';

const freeList = [
  'Formaldehyde',
  'Fragrances',
  'Toluene',
  'Formaldehyde Resin',
  'DBP (Dibutyl phthalate)',
  'Parabens',
  'Camphor',
  'Ethyl Tosyl',
  'Xylene',
];

const LandingFreeSection = () => {
  return (
    <div className={style.container}>
      <div className={style.toxinFree}>
        <div className={style.titleLine}>
          <img src={circleLogo1} className={style.logo} />
          <div className={style.title}>TOXIN FREE</div>
        </div>
        <div className={style.description}>
          ManiMe Stick On Gels are 10-FREE. We have managed to remove 10 harmful chemicals that you should not be exposed to.
        </div>
        <div className={style.freeList}>
          {freeList.map(item => (
            <div className={style.freeListItem} key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className={style.crueltyFree}>
        <div className={style.titleLine}>
          <img src={circleLogo2} className={style.logo} />
          <div className={style.title}>CRUELTY FREE</div>
        </div>
        <div className={classNames(style.description, style.crueltyDescription)}>
          And we are Leaping Bunny approved, 100% CRUELTY-FREE. No animals were harmed for your beauty.
        </div>
        <img
          className={style.crueltyFreeLogo}
          src='/static/icons/product-detail/cruelty-free.svg'
          alt='cruelty-free' />
      </div>
    </div>
  );
}

export default LandingFreeSection;

import React from 'react';
import style from './css/covid-care-blm.module.css';

const svgPath = '/static/icons/covid-care-blm-desk.svg';

const CovidCareBLM = () => {
  return (
    <div className={style.container}>
      <img src={svgPath} className={style.imagePanel} />
      <div className={style.textPanel}>
        The ManiMe CARE Collection unites 11 nail artists, each with a unique style and perspective, to support marginalized and vulnerable communities.
        <br /><br />
        We are donating 100 percent of the profits from the CARE Collection to two organizations: PBA COVID-19 Relief Fund and the Movement for Black Lives Fund.
      </div>
    </div>
  );
};

export default CovidCareBLM;
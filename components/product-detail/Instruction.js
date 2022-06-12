import React, { useState } from 'react';
import { Collapse } from 'react-collapse';
import Details from './Details';
import HowToUse from './HowToUse';
import youtubeLinks from '../../utils/youtubeLinks'
import style from './css/instruction.module.css';

const theme = {collapse: style.collapse, content: style.content};

const Instruction = ({ isPedis }) => {
  const [openDetails, setOpenDetails] = useState(true);
  const [openHowToUse, setOpenHowToUse] = useState(false);

  const toggleDetails = () => {
    setOpenDetails(opened => (!opened));
  };

  const toggleHowToUse = () => {
    setOpenHowToUse(opened => (!opened));
  };

  return (
    <div>
      <div className={style.menuItem}>
        Details
        <span className={style.plusMinus} onClick={toggleDetails}>{openDetails? '−': '+'}</span>
      </div>
      <Collapse isOpened={openDetails} theme={theme}>
        <Details isPedis={isPedis} />
      </Collapse>
      <div className={style.menuItem}>
        How To Use
        <span className={style.plusMinus} onClick={toggleHowToUse}>{openHowToUse? '−': '+'}</span>
      </div>
      <Collapse isOpened={openHowToUse} theme={theme}>
        <HowToUse isPedis={isPedis} />
      </Collapse>
    </div>
  );
};

export default Instruction;
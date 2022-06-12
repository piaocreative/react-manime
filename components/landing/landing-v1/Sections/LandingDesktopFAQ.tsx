import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

import { faqList } from '../../../howto/apply/HowToFAQSection';
import style from './css/landing-desktop-faq.module.css';

const LandingDesktopFAQ = props => {
  return (
    <div className={style.container}>
      <div className={style.title}>MANIME 101</div>
      <div className={style.main}>
      {faqList.map((item, index) =>(
        <div key={index} className={classNames(style.onePanel, index === 1 && style.middleItem)}>
          <div className={style.question}>{item.question}</div>
          <div className={style.answer}>{item.answer}</div>
        </div>
      ))

      }
      </div>
      <div className={style.moveToFAQ}>Have more questions? Check out our <Link href='/faq'><a style={{textDecoration: 'underline'}}>FAQs</a></Link></div>
    </div>
  );
};

export default LandingDesktopFAQ;

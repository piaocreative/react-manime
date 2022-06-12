import React, { useState, Fragment } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { Collapse } from 'react-collapse';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/howto/apply/howto-faq101.module.css';
;
const maxTopCoatLink = `${pageLinks.ProductDetail.url}max-top-coat`

const HowLongJsx = () => (
  <div>
    Up to 10 days. Keep your gels looking fresh with a quick file or a <Link href={`${pageLinks.ProductDetail.url}[handle]`} as={maxTopCoatLink}>
      <a className={style.underline}>Max Top Coat</a></Link> application as needed. You can shower, work out, and wash your hands without worry!

  </div>
);

export const faqList = [
  {question: 'How long do they last?', answer: <HowLongJsx />},
  {question: 'What are they made of?', answer: 'Non-toxic, cruelty-free, and 10-free gel. Forget all the smells, harmful chemicals, and or UV lights and apply a mani or pedi at home in just minutes.'},
  {question: 'How do I take them off?', answer: 'Simply peel your mani or pedi off in seconds and be ready for your next set! For damaged or weak nails, soak your nails in warm water before removing the gels.'},
];

const theme ={collapse: style.collapse, content: style.content};

const HowToFAQSection = ({ isLanding }) => {
  const [openStatus, setOpenStatus] = useState([false, false, false]);
  const toggleHandler = index => () => {
    let newOpenStatus = [...openStatus];
    newOpenStatus[index] = !newOpenStatus[index];
    setOpenStatus(newOpenStatus);
  };

  return (
    <div className={classNames(style.container, isLanding && style.landingContainer)}>
      {/* DESKTOP VIEW */}
      <div className={style.titlePanel}>
        <div className={classNames(style.title, isLanding && style.landingTitle)}>
          MANIME 101
        </div>
        <div className={style.moreQuestions}>
          Have more questions? <br /> <Link href='/faq'> Check our FAQ.</Link>
        </div>
      </div>

      {/* MOBILE */}
      <div className={style.mobileView}>
        <div className={classNames(style.title, isLanding && style.landingTitle)}>
          MANIME 101
        </div>
      </div>
      <div className={classNames(style.faqContainer, isLanding && style.landingFaqContainer)}>
        {faqList.map((item, index) => (
          <Fragment key={index}>
            <div
              className={classNames(style.question, {
                [style.topBorder]: index === 0,
                [style.bottomBorder]: index === 2,
                [style.upper]: !isLanding,
                [style.landingQuestion]: isLanding
              })}
              onClick={toggleHandler(index)}>
              {item.question}
              <span className={classNames(style.expandLabel, isLanding && style.landingExpandLabel)}>{openStatus[index] ? '−': '+'}</span>
            </div>
            <Collapse
              isOpened={openStatus[index]}
              theme={theme}>
              {item.answer}
            </Collapse>
          </Fragment>
        ))}
      </div>
      <div className={style.mobileView}>
        <div className={classNames(style.moreQuestions, isLanding && style.landingMoreQuestions)}>
          Have more questions? <br /> <Link href='/faq'> Check our FAQ.</Link>
        </div>
      </div>
    </div>
  );
};

export default HowToFAQSection;
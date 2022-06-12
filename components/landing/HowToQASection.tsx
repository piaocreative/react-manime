import React from 'react';
import Link from 'next/link';
import style from '../../static/components/howto/howto-qa.module.css';
import { pageLinks } from '../../utils/links';

const qaList = [
  {
    question: 'HOW LONG DO THEY LAST?',
    answer: (
      <>Up to <span className={style.boldLabel}>10 days.</span> Keep them looking fresh with a new file as needed. You can shower, workout, and wash your hands without worry!</>
    )
  },
  {
    question: 'WHAT ARE THEY MADE OF?',
    answer: (
      <><span className={style.boldLabel}>Non-toxic, cruelty-free, 10-free gel.</span> Forget all the smells, harmful chemicals or UV lights and apply them at home in just minutes.</>
    )
  },
  {
    question: 'HOW DO I TAKE THEM OFF?',
    answer: (
      <>Just <span className={style.boldLabel}>peel them off</span> in seconds and be ready for your next set! Forget the chemicals and painful gel removal.</>
    )
  },
];

const HowToQASection = () => {

  return (
    <div className={style.container}>
      <div className={style.title}>SUPER FREQUENTLY ASKED QUESTIONS</div>
      <div className={style.content}>
      {qaList.map((item, index) => (
        <div key={index} className={style.qaItem}>
          <div className={style.question}>{item.question}</div>
          <div className={style.answer}>{item.answer}</div>
        </div>
      ))}
      </div>
      Have more questions? <Link href={pageLinks.Faq.url}><span className={style.linkLabel}>Check our FAQ.</span></Link>
    </div>
  );
}

export default HowToQASection;
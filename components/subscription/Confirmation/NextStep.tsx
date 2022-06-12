import React from 'react';
import globalStyles from '@styles/basic/buttons.module.css';
import buttonStyle from '@styles/gift/group/redeem.module.css';
import {useRouter} from 'next/router'
import {pageLinks} from 'utils/links'
import styles from '@styles/gift/group/confirmation.module.css'

// TODO: need to normalize the shipping details to a central location
const steps = [
  {
    index: 1,
    title: 'Ship',
    text: 'Your monthly subscription will be delivered to your address in 4-7 business days',
    icon: '/static/icons/group-gift-ship.svg',
  },
  {
    index: 2,
    title: 'Enjoy',
    text: 'Apply your gels - manis are best enjoyed with friends!',
    icon: '/static/icons/group-gift-enjoy.svg',
  },
];

export default function ConfirmNextStep({}) {

  const router = useRouter();
  function goToNext(){
    router.push(pageLinks.HowToApply.url)
  }
  return (
    <div className={styles.confirmNextContainer} >
      <div style={{paddingBottom: '20px'}}>
        Thank you for making ManiMe part of your beauty and self-care routine. Our team will get this fulfilled and out to you very soon! 
      </div>
      <div className={styles.confirmNextLabel}>
        What’s next?
      </div>
      <div className={styles.confirmNextStepHeader}>
        {steps.map(item => (
          <div className={styles.nextStepTitle} key={`title-${item.index}`}>
            {item.title}
          </div>
        ))}
      </div>
      <div className={styles.confirmNextStepContent}>
        {steps.map(item => (
          <div key={`content-${item.index}`} style={{flex: 1}}>
            <div className={styles.nextStepIndex}>
              {item.index}
            </div>
            <div>
              <img className={styles.nextStepWaterDrop} src={item.icon} alt='water-drop' />
            </div>
            <div className={styles.nextText}>
              {item.text}
            </div>                        
          </div>
        ))}
      </div>
      <div style={{height: '40px'}} />
      <button
        className={`${globalStyles.darkButton} ${buttonStyle.darkButton}`}
        onClick={goToNext}
      >Check our how to guide
      </button>

    </div>
  );
}
import React from 'react';
import Link from 'next/link';
import Bubble from 'components/icons/Bubble';
import SolidDropWithTag from 'components/product-item/SolidDropWithTag';

import { pageLinks } from 'utils/links';
import style from './css/solid-bubbles-panel.module.css';
import { OutlinedDarkButton } from 'components/basic/buttons';

const SolidBubblesPanel = ({ productList=[], isSolidChoice=false, isPedis=false, isMobileView }) => {
  // console.log({at: 'SolidBubblesPanel2', productList});

  return (
    <div className={style.container}>
      <div className={style.title}>Pick Your Shade</div>
      <div className={style.bubbleList}>
        {productList.map((item, itemIndex) => (
          <div key={item.nailProductId || itemIndex} className={style.bubbleItem}>
            <SolidDropWithTag
              linkHandle={item.shopifyHandle}
              color={item.Color}
              image={item.DropletImageUrl}
              className={style.bubble}
              productId={item.nailProductId} />
            <div className={style.bubbleLabel}>
              {item.nnnName} {item.nnnName && <br />} {item.name}
            </div>
          </div>
        ))}
        {!isSolidChoice &&
          (isMobileView ?
            <Link href={pageLinks.Collection['Solid Colors'].url}>
              <OutlinedDarkButton passedClass={style.mobileCheckSolidButton}>
                Explore Solid Colors
              </OutlinedDarkButton>
            </Link>:
            <div key='Solid Colors' className={style.bubbleItem}>
              <Link href={pageLinks.Collection['Solid Colors'].url}>
                <a>
                  <Bubble className={style.bubble} color='white' border='black' />
                  <OutlinedDarkButton passedClass={style.checkSolidButton}>
                    Explore Solids
                  </OutlinedDarkButton>
                </a>
              </Link>
            </div>
          )
        }
        </div>
    </div>
  );
};

export default SolidBubblesPanel;

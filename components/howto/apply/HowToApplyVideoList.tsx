import React from 'react';
import Link from 'next/link';
import HowToApplyVideoSection from '../../../components/howto/apply/HowToApplyVideoSection';
import { pageLinks } from '../../../utils/links';
import style from './css/how-to-apply-video-list.module.css';

export const howToList = [
  {
    stepName: 'Step 1',
    shortName: 'Prep',
    fullName: 'Prep your nails',
    note: 'Start fresh with clean, oil-free nails.',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-step-1.mp4?v=1609926884',
    iconUrl: '/static/icons/how-to-apply/step-1-active.svg',
    descriptions: [
      {
        checked: true,
        jsx: <><span>Wash hands</span> with soap and water. Let dry.</>
      },
      {
        checked: true,
        jsx: <>Using the <span>prep pad</span> thoroughly clean each nail. </>,
      },
      {
        checked: true,
        jsx: <>Weak or brittle nails? Apply a <Link href={`${pageLinks.ProductDetail.url}miracle-base-coat`}><a>base coat</a></Link> to strengthen and protect your nails. Let dry completely. </>,
      },
      {
        checked: false,
        jsx: <>Avoid using lotion or cuticle oil directly before or after you apply gels.</>
      }
    ]
  },
  {
    stepName: 'Step 2',
    shortName: 'Apply',
    fullName: 'Peel & Apply',
    note: 'It’s easy!',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-step-2.mp4?v=1609926885',
    descriptions: [
      {
        checked: true,
        jsx: <>Peel off one gel from the sheet at a time. </>
      },
      {
        checked: true,
        jsx: <>Hold the gel over your nail to <span>line it up evenly</span> before applying. </>,
      },
      {
        checked: true,
        jsx: <>As you apply, <span>leave a small gap</span> between your cuticle and the start of the gel. </>,
      },
      {
        checked: false,
        jsx: <>Avoid touching the adhesive side as much as possible.</>
      }
    ]
  },
  {
    stepName: 'Step 3',
    shortName: 'Press',
    fullName: 'Smooth & fold',
    note: 'You’re almost there!',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-step-3.mp4?v=1609926883',
    descriptions: [
      {
        checked: true,
        jsx: <><span>Press firmly</span> to smooth out any wrinkles. </>
      },
      {
        checked: true,
        jsx: <>Fold the excess gel over the tip of your nail.  </>,
      },
      {
        checked: true,
        jsx: <>Wait 30 seconds before filing - Use this time to press and smooth each gel again.</>,
      },
    ]
  },
  {
    stepName: 'Step 4',
    shortName: 'File',
    fullName: 'Clip or file downwards',
    note:
      <>
        Using the nail file in your kit, file downwards at the tips of your nails to remove excess gel. <br />
        You got this!
      </>,
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-step-4.mp4?v=1609926885',
    descriptions: [
      {
        checked: true,
        jsx: <><span>Angle the file</span> away from your nail to avoid tearing the gel & to create a clean edge.</>
      },
      {
        checked: true,
        jsx: <>For <span>short nails</span>, we recommend using a <span>nail clipper</span> instead of a file.  </>,
      },
      {
        checked: true,
        jsx: <>After filing and removing the excess, press down firmly on your gels to smooth them</>,
      },
    ]
  },
  {
    stepName: 'Step 5',
    shortName: 'Seal',
    fullName: 'Seal your gels',
    note: 'Prolong the life of your gel by using a top coat.',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-step-5.mp4?v=1610580673',
    descriptions: [
      {
        checked: true,
        jsx:
        <>
          Finish by applying a <Link href={`${pageLinks.ProductDetail.url}mirella-top-coat`}><a>top coat.</a></Link> <br />
          Add a bit more over and under <br />
          the <span>tip of your nail.</span>
        </>

      },
    ]
  },
  

];

const HowToApplyVideoList = ({ sectionRefs, setActiveSectionIndex }) => {

  return (
    <div className={style.container}>
      {howToList.map((howToData, index) => (
        <HowToApplyVideoSection
          key={howToData.shortName}
          ref={sectionRefs[index].ref}
          index={index}
          data={howToData}
          reverse={index % 2 === 1} />
      ))
      }
    </div>
  );
};

export default HowToApplyVideoList;

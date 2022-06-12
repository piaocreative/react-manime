import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import classNames from 'classnames';
import designersData from '../../../designersData';
import style from './css/designer-photo-section.module.css';

const DesignerPhotoSection = ({ name='', designerData=undefined }) => {
  // console.log({at: 'DesignerPhotoSection', designerData})
  const designerDataFromFile = designersData[name];
  const designerName = designerData?.siteDisplayNickname || designerData?.designerName || designerDataFromFile?.designerName || 'MISSING DESIGNER NAME';
  const designerPhoto = designerData?.portraitImage || designerData?.portraitImageUrl || designerDataFromFile?.designerPhoto || 'MISSING DESIGNER PHOTO';
  const description = designerData?.designerPageSubtitle || designerData?.personalStory || designerDataFromFile?.description1 || 'MISSING DESIGNER DESCRIPTION';
  const designerLogo = designerData?.logoImage || designerData?.logoImageUrl || designerDataFromFile?.designerLogo;
  const isCircleLogo = designerData?.isCircleLogo || designerDataFromFile?.isCircleLogo || 'MISSING LOGO STYLE';
  return (
    <div className={style.container}>
      <div className={style.designerName}>
        {designerName}
      </div>
      <img
        className={style.designerPhoto}
        src={designerPhoto} />
      <div className={style.description}>
        {ReactHtmlParser(description)}
      </div>
      {designerLogo &&
        <img
          className={classNames(style.designerLogo, isCircleLogo && style.circleLogo)}
          src={designerLogo} />
      }
    </div>
  );
}

export default DesignerPhotoSection;

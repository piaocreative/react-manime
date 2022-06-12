import React, { useCallback } from 'react';
import { motion } from 'framer-motion'
import { DarkButton } from '../../basic/buttons';

import style from '../../../static/components/design/filter/filtered-tags.module.css';

const FilteredTagsLine_V2 = ({tags, onToggleTag, clearTags }) => {
  const colorTags = tags.filter(tag => tag.color);
  const styleTags = tags.filter(tag => !tag.color);
  const renderTags = useCallback(tagList => (
    tagList.map(item => (
      <DarkButton key={item.tag} isSmall passedClass={style.tagButton} onClick={() => onToggleTag(item)}>
        {item.tag === 'signature' ? 'Signature' : item.label}
        <div className={style.closeIcon}>×</div>
      </DarkButton>
    ))
  ), [tags, onToggleTag])
  const showRow = colorTags.length > 0 || styleTags.length > 0;
  return (
    <motion.div className={style.tagsContainer} style={{paddingLeft: '20px'}} transition={{ duration: .2 }} animate={{height: showRow ? '50px' : 0}}>
      {(colorTags && colorTags.length > 0) && <div className={style.label}>COLOR:</div>}
      {renderTags(colorTags)}
      {(styleTags && styleTags.length > 0) && <div className={style.label}>STYLE:</div>}
      {renderTags(styleTags)}
      {/* {colorTags.map(item => (
        <DarkButton key={item.tag} isSmall passedClass={style.tagButton} onClick={() => onToggleTag(item)}>
          {item.tag === 'signature' ? 'Signature' : item.label}
          <div className={style.closeIcon}>×</div>
        </DarkButton>
      ))} */}
      {tags.length > 0 &&
        <div className={style.clearAll} onClick={clearTags}>Clear All</div>
      }
    </motion.div>
  );
}

export default FilteredTagsLine_V2;
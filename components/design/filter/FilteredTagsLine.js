import React from 'react';
import { DarkButton } from '../../basic/buttons';

import style from '../../../static/components/design/filter/filtered-tags.module.css';

const FilteredTagsLine = ({tags, onToggleTag, clearTags }) => {
  return (
    <div className={style.tagsContainer}>
    {tags.map(item => (
      <DarkButton key={item.tag} isSmall passedClass={style.tagButton} onClick={() => onToggleTag(item)}>
        {item.tag === 'signature' ? 'Signature': item.tag === 'nude'? 'Neutral' : item.label}
        <div className={style.closeIcon}>×</div>
      </DarkButton>
    ))}
    {tags.length > 0 &&
      <div className={style.clearAll} onClick={clearTags}>Clear All</div>
    }
    </div>
  );
}

export default FilteredTagsLine;
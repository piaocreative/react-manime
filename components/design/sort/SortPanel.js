import React from 'react';
import classNames from 'classnames';
import style from '../../../static/components/design/sort/sort-panel.module.css';

const SortPanel = ({ sortIndex, sortList, changeSortHandler, onClose }) => {
  return (
    <>
      <div className={style.container}>
        {sortList.map((item, index) => 
          <div
            key={index}
            className={classNames(style.option, sortIndex === index && style.selectedItem)}
            onClick={() => changeSortHandler(index)}>
            {item.label}
          </div>
        )}
      </div>
      <div className={style.overlay} onClick={onClose} />
    </>
  );
}

export default SortPanel;
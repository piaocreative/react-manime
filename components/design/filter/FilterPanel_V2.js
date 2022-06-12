import React from 'react';
import classNames from 'classnames';
import Accordion from './Accordion';
import { WhiteButton, DarkButton } from '../../basic/buttons';
import ColorBubble from './ColorBubble';
import SilverBubble from './SilverBubble';
import GoldBubble from './GoldBubble';
import MultipleBubble from './MultipleBubble';

import style from '../../../static/components/design/filter/filter-panel-v2.module.css';

const colorList = [
  {tag: 'black', label: 'black', color: '#000'},
  {tag: 'white', label: 'white', color: '#fff'},
  {tag: 'yellow', label: 'yellow', color: '#f7e784'},
  {tag: 'neutral', label: 'neutral', color: '#f7daae'},
  {tag: 'red', label: 'red', color: '#e01616'},
  {tag: 'pink', label: 'pink', color: '#ff8896'},
  {tag: 'purple', label: 'purple', color: '#c29cd6'},
  {tag: 'blue', label: 'blue', color: '#486e92'},
  {tag: 'green', label: 'green', color: '#547d56'},
];

const finishList = [
  {label: 'solid', tag: 'Solid choice', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/solid.svg?v=1599496567'},
  {label: 'sheer', tag: 'sheer', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/sheer.svg?v=1599496567'},
  {label: 'clear', tag: 'clear', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/clear.svg?v=1599496566'},
  {label: 'matte', tag: 'matte', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/matte.svg?v=1599496567'},
  {label: 'glitter', tag: 'glitter', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/glitter.svg?v=1599496568'},
  {label: 'metallic', tag: 'metallic', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/metallic.svg?v=1599496567'},
  {label: 'french', tag: 'french', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/french.svg?v=1599496568'},
  {label: 'cuticle', tag: 'cuticle', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/cuticle.svg?v=1599496566'},
  {label: 'half moon', tag: 'halfmoon', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/half_moon.svg?v=1599496722'},
  {label: 'gradation', tag: 'gradation', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/gradation.svg?v=1599496567'},
  {label: 'floral', tag: 'floral', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/floral.svg?v=1599496567'},
  {label: 'animal', tag: 'animal', iconUrl: 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/animal.svg?v=1599496566'},
];

const silverTag = {label: 'silver', tag: 'silver', color: 'silver'};
const goldTag = {label: 'gold', tag: 'gold', color: 'gold'};
const multipleTag = {label: 'multicolor', tag: 'multicolor', color: 'multicolor'};

const FilterPanel = ({ onToggleTag, tags, onClose, onClear }) => {

  return (
    <>
      <div className={style.container}>
        <Accordion
          isFirst
          title='BY COLOR'>
          {[0, 1].map(rowIndex => (
            <div className={style.colorRow} key={rowIndex}>
            {colorList.slice(6 * rowIndex, 6 * rowIndex + 6).map(item => {
              return (
                <div key={item.color} className={style.bubbleItem}>
                  <ColorBubble
                    selected={tags.includes(item)}
                    label={item.label}
                    color={item.color}
                    border={tags.includes(item) ? '#2c4349' : ''}
                    onClick={() => onToggleTag(item)} />
                </div>
              );
            })
            }
            {rowIndex === 1 &&
              <>
                <div className={style.bubbleItem}>
                  <SilverBubble
                    selected={tags.includes(silverTag)}
                    label={silverTag.label}
                    border={tags.includes(silverTag) ? '#2c4349' : ''}
                    onClick={() => onToggleTag(silverTag)} />
                </div>
                <div className={style.bubbleItem}>
                  <GoldBubble
                    selected={tags.includes(goldTag)}
                    label={goldTag.label}
                    border={tags.includes(goldTag) ? '#2c4349' : ''}
                    onClick={() => onToggleTag(goldTag)} />
                </div>
                <div className={style.bubbleItem}>
                  <MultipleBubble
                    selected={tags.includes(multipleTag)}
                    label={multipleTag.label}
                    border={tags.includes(multipleTag) ? '#2c4349' : ''}
                    onClick={() => onToggleTag(multipleTag)} />
                </div>
              </>
            }
            </div>
          ))}
        </Accordion>

        <Accordion
          title='BY STYLE'>
          {finishList.map(item => {
            const isSelected = tags.includes(item);
            return (
              <WhiteButton key={item.label} passedClass={classNames(style.iconButton, isSelected && style.selectedButton)} onClick={() => onToggleTag(item)}>
                <img className={style.iconButtonIcon} src={item.iconUrl} />
                {item.label}
              </WhiteButton>
            );
          })}
          <WhiteButton passedClass={style.applyButton} onClick={onClear}>
            CLEAR ALL
          </WhiteButton>
          <DarkButton passedClass={style.applyButton} onClick={onClose}>
            APPLY FILTER
          </DarkButton>
        </Accordion>
      </div>
      <div className={style.overlay} onClick={onClose}>
        <div className={style.closeButton}>×</div>
      </div>
    </>
  );
}

export default FilterPanel;

import classNames from 'classnames';
import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useRef } from 'react';
import { pageLinks } from '../../utils/links';
import style from './css/shop-menu.module.css';

const isInEnvironment = environment => row => row?.fields?.Environment === environment;
const isInMenu = menuName => row => row?.fields?.['Menu Name']?.includes(menuName);
const isInSection = sectionId => row => row?.fields?.Section?.includes(sectionId);
const isType = menuType => row => row?.fields?.Type === menuType;
const hasName = name => row => row?.fields?.Name === name;
const isPreview = row => row?.fields?.Preview === 1;

const ShopMenu = ({ onClose, globalProps }) => {
  const menuInfo = JSON.parse(globalProps.menuInfo);
  const desktopMenuItems = menuInfo?.filter(isInEnvironment('Desktop'));
  const shopMenuInfo = desktopMenuItems?.filter(hasName('Shop'))?.[0];
  const shopMenuSections = desktopMenuItems?.filter(isInMenu('Shop')).filter(isType('Section'));
  const shopMenuLeftImage = shopMenuInfo?.fields?.['Left Image']?.[0];
  const shopMenuLeftImageUrl = shopMenuLeftImage?.thumbnails?.large?.url;
  const shopMenuLeftImageLink = shopMenuInfo?.fields?.['Left Image Link'] || pageLinks.Home.url;
  const shopMenuSectionItems = id => desktopMenuItems?.filter(isInSection(id));

  const useOutsideAlerter = ref => {
    useEffect(() => {
      const handleClickOutside = event => {
        if (ref.current && !ref.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);

  const moveToHandler = url => () => Router.push(url);

  useOutsideAlerter(wrapperRef);

  return (
    <div
      className={style.container}
      ref={wrapperRef}
      onMouseLeave={onClose}
      data-testid="shopMenuHoverBox"
    >
      {shopMenuLeftImage && (
        <Link href={shopMenuLeftImageLink}>
          <a data-testid="shop-link">
            <picture className={style.leftImage}>
              <img className={style.leftImage} src={shopMenuLeftImageUrl} />
            </picture>
          </a>
        </Link>
      )}
      {shopMenuSections.map((section: any) => {
        const sectionCss = section?.fields?.Name?.toLowerCase()?.replaceAll(' ', '-');
        const sectionClass = `${sectionCss}-section`;
        const sectionItemClass = `${sectionCss}-item`;
        return (
          <div className={classNames(style.oneColumn, style[sectionClass])} key={section.id}>
            <div
              className={classNames(style.columnTitle, section?.fields?.Link && style.pointer)}
              onClick={moveToHandler(section.fields.Link)}
            >
              {section.fields.Name}
            </div>
            <div className={classNames(style.menuItems, section.className)}>
              {/* {console.log({ section, items: shopMenuSectionItems(section.id) })} */}
              {shopMenuSectionItems(section.id)?.map(
                item =>
                  item.fields.Link && (
                    <Link key={item.id} href={item.fields.Link}>
                      <a
                        data-testid={`${
                          isPreview(item) ? 'preview-' : ''
                        }${item?.fields?.Link?.replace('/', '')}Link`}
                      >
                        <div
                          className={classNames(
                            style.menuItem,
                            item.isSale && style.saleItem,
                            style[sectionItemClass],
                            isPreview(item) && style.preview
                          )}
                          style={{
                            color: item.fields.color,
                            backgroundColor: item.fields.backgroundColor,
                            // TODO: Figure out Custom styling
                            // ...JSON.parse(item?.fields?.Style || {}),
                          }}
                        >
                          {item.fields.Name}
                          {item.fields.Tag === 'new' && <div className={style.newBadge}>new</div>}
                        </div>
                      </a>
                    </Link>
                  )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopMenu;

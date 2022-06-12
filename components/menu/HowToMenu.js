import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { UI_SET_KEY_VALUE } from '../../actions';
import { pageLinks } from '../../utils/links';
import style from './css/howto-menu.module.css';

const menuList = [
  {
    title: '',
    menuItems: [
      pageLinks.HowToApply,
      pageLinks.HowItWorks,
    ]
  },
];

const HowToMenu = ({ onClose, dispatchSetVideoDialog }) => {
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          onClose();
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  const openVideoHandler = () => {
    dispatchSetVideoDialog(true);
  };

  return (
    <div className={style.container} ref={wrapperRef} onMouseLeave={onClose}>
      {menuList.map((menu, menuIndex) => {
        return (
          <div className={style.oneColumn} key={menuIndex}>
            <div className={style.columnTitle}>{menu.title}</div>
            {menu.menuItems.map((item, index) =>
            <Link key={`${index}-${item.label}`} href={item.url}>
              <a>
                <div className={style.menuItem}>
                  {item.label}
                </div>
              </a>
            </Link>
            )}
          </div>
        );
      })}
      <img
        className={style.learnMenuBanner}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/menu-learn.jpg?v=1596811278'
        onClick={openVideoHandler}
        alt='learn' />
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  dispatchSetVideoDialog: isOpen => dispatch(UI_SET_KEY_VALUE('isVideoDialogOpen', isOpen)),
});


export default connect(null, mapDispatchToProps)(HowToMenu);
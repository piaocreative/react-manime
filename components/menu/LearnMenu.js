import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { pageLinks } from '../../utils/links';
import style from './css/learn-menu.module.css';

const menuList = [
  {
    title: '',
    menuItems: [
      pageLinks.AboutUs,
      pageLinks.Blog,
      pageLinks.Faq,
    ]
  },
];

const LearnMenu = ({ onClose, dispatchSetVideoDialog }) => {
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

  return (
    <div className={style.container} ref={wrapperRef} onMouseLeave={onClose}>
      {menuList.map((menu, menuIndex) => {
        return (
          <div className={style.oneColumn} key={menuIndex}>
            <div className={style.columnTitle}>{menu.title}</div>
            {menu.menuItems.map((item, index) =>
            <Link key={index} href={item.url}>
              <a>
                <div
                  key={`${index}-${item.label}`}
                  className={style.menuItem}>
                  {item.label}
                </div>
              </a>
            </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearnMenu;
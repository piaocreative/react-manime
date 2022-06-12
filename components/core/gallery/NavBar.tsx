import React from 'react';
import {useRouter} from 'next/router'
import {pageLinks} from 'utils/links'
import style from '@styles/gift/group/styles.module.css';
export default function NavHeader({navTitle, hideBack=false}: {navTitle: string, hideBack?: boolean}) {

  const router = useRouter();
  return (
    <div
      className={style.navHeader}
    >

      <img
      style={{ height: '20px', paddingLeft: '15px', opacity: hideBack ? 0 : 1 }}
      src="/static/icons/arrow-left-nocircle.svg"
      onClick={() => !hideBack && router.back()}
    ></img>


      <div
        style={{
          flex: 10,
          textAlign: 'center',
          fontFamily: 'GentiumBasic',
          fontSize: '24px',
        }}
      >
        {navTitle}
      </div>
      <img
        style={{ height: '20px', paddingRight: '15px' }}
        src="/static/icons/close-dark-icon.svg"
        onClick={() => router.push(pageLinks.SetupDesign.url)}
      ></img>
    </div>
  );
}

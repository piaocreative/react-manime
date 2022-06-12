import React, {useState} from 'react'
import style from 'static/components/fitting/guided/fingers.module.css';
import {useRouter} from 'next/router'
import Link from 'next/link'
import {pageLinks} from 'utils/links'
import { motion } from 'framer-motion';
export default function NavigationBar() {

  const [isMenuShowing, setIsMenuShowing] = useState(false)
  const router = useRouter();
  function hideMenu() {
    setIsMenuShowing(false)
  }
  function showMenu(){
    setIsMenuShowing(true)
  }

  const variants = {
    open: {
      width: '120px'
    },
    closed: {
      width: '0px'
    }
  }

  return (
    <div className={style.scanNavigationBar}>
      <div onClick={() => router.back()} style={{textTransform: 'uppercase'}}>Back</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        }}
      >
        <span
          style={{
            fontFamily: 'AvenirHeavy',
            fontSize: '18px',
            lineHeight: '5px',
            color: 'white',
            paddingTop: '3px',
          }}
          onClick={showMenu}
        >
          &#8230;
        </span>

          <motion.div style={{overflowX:'hidden', overflowY: 'visible',  marginTop: '-10px', marginBottom: '-15px', marginRight: '-3px'}}
            animate={isMenuShowing? "open": "closed"}
            variants={variants}
          >
            <div className={style.scanMenu} >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={pageLinks.SetupDesign.url}>
                <a className={style.menuItem}>Exit</a>
              </Link>

              <div onClick={hideMenu} className={style.closeMenu}>
                <img
                  style={{ width: '12px' }}
                  src="/static/icons/close-dark-icon.svg"
                />
              </div>
            </div>
            </div>
          </motion.div>
      
      </div>
    </div>
  );
}

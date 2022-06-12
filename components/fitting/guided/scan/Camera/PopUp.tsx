import React, {useEffect, useState,} from 'react'
import { motion, useMotionValue, useTransform, usePresence,  } from 'framer-motion';
import { DarkButton } from 'components/basic/buttons';


function PopUp({open, children, dissmissText="Ok"}){
  const [isOpen, setIsOpen] = useState(false)
  const [isPresent, safeToRemove] = usePresence();
  async function runOpen(){
    setTimeout(()=>setIsOpen(open), 200)
  }

  useEffect(()=>{
    runOpen()
  }, [])


  const variants = {
    open: {

      opacity: 1,
      display: 'flex',
      transition: {

        duration: .2
      }
    },
    closed: {

      opacity: 0,
      transitionEnd: {
        display: 'none'
      },
      transition: {

        duration: .2
      }
    }
  };

  const innerVariants ={
    open: {
      scale: 1,
      opacity: 1,
      transtion: {
        type: "spring",
        scale: { stiffness: 1000, velocity: -100 },
        duration: 1
      }
    }, 
    closed: {
      scale: 0,
      opactity: 0,
      transtion: {
        type: 'spring',
        scale: { stiffness: 1000 },
        duration: .2
      }
    }
  }
  function togglePopUp(){
    setIsOpen((isOpen=>!isOpen))
  }



  return (
  <motion.div 
      animate={isOpen?"open":"closed"}
      variants={variants}
      onClick={togglePopUp}
      style={{position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center', 
              backgroundColor: '#00000085', zIndex: 100, opacity: 0, display: 'none'}}>
          <motion.div style={{borderRadius: '2px', padding: '2em', opacity: 1, boxShadow: '5px 10px #888888;' , display: 'flex' , flexDirection:'column', justifyContent: 'flex-end', backgroundColor: 'ghostwhite', }}
            onClick={(ev)=>{
              ev.stopPropagation();
            }}
            animate={isOpen?"open":"closed"}
            variants={innerVariants}
          >

            {children}

            <DarkButton onClick={()=>{togglePopUp()}}> {dissmissText}</DarkButton>
          </motion.div>

      </motion.div>
  )
}

export default PopUp
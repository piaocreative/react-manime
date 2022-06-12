import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import AuthWall from 'components/AuthWallHOC';
import { pageLinks } from 'utils/links';
import Loading from 'components/LoadingAnimation'
import { track } from 'utils/track';
import log from 'utils/logging'
import { AvailableCarts } from 'actions/cart';
import { checkManiBag } from 'utils/cartUtils';
import { hasValidManiProfile, hasValidPediProfile } from 'utils/profileData'
export default function FitWall(WrappedComponent:any, cartName=AvailableCarts.MainCart, forceManiCheck=false, forcePediCheck=false) {


  function _FitWall(props) {

    const { profileData, isProfileReady} = 
      useSelector((state : any)=>{
        return  { 
          profileData: state.profileData, 
          isProfileReady: state.profileData.isReady 
        }
      });
    const { cartData, isCartReady } = 
      useSelector((state : any)=>{
        return {
          cartData: state[cartName],
          isCartReady: state[cartName].isReady
        }
      });
    const [isMounted, setIsMounted] = useState(false);
    const [isFitted, setIsFitted] = useState(false)

    function checkFitStatus(){
      const { hasManis, hasPedis } = checkManiBag(cartData.cart);    
      const manisProfile = profileData.profiles.find(profile => profile.profileType === 'Manis') || {};
      const pedisProfile = profileData.profiles.find(profile => profile.profileType === 'Pedis') || {};
      
      if (forceManiCheck || hasManis) {
        const isManiReady = hasValidManiProfile(manisProfile)
        if (!isManiReady) {
          track('[FitWall][checkFitStatus] transfer to fitflow', {missing : 'mani'})
          Router.replace({
            pathname: pageLinks.GuidedFitting.url,
            query: {
              skippable: false,
              returnUrl: Router.asPath,
              hasManis
            }
          });
          return false;
        }
      }
      if (forcePediCheck || hasPedis) {
        const isPediReady = hasValidPediProfile(pedisProfile)
        
        if (!isPediReady) {
          track('[FitWall][checkFitStatus] transfer to fitflow', {missing : 'pedi'})
          Router.replace({
            pathname: pageLinks.PediFitting.url,
            query: {
              skippable: false,
              returnUrl: Router.asPath,
              hasPedis
            }
          });
          return false;
        }
      }
      setIsFitted(true)
      return true;
    }
    useEffect(() => {
      log.info('[FitWall][mount]', {url: Router.asPath})
      if(!isMounted && (isCartReady || forceManiCheck || forcePediCheck) && isProfileReady){
        setIsMounted(true);
        checkFitStatus();
      }
    }, [isCartReady, isProfileReady])

    
    let toRender = <div>
      {
        false && 
        <>
        isMounted: {JSON.stringify(isMounted)} <br />
        isFitted: {JSON.stringify(isFitted)} 
        </>
      }

    </div>;
    if(isMounted && isFitted){
      toRender = <WrappedComponent {...props} /> 
      track(`[FitWall] render: fitting passed`, { url: Router.asPath });
    };
    return (
      toRender
    );

  };

  return AuthWall(_FitWall);
}

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { Auth } from '@aws-amplify/auth';
import { pageLinks } from '../utils/links';
import Loading from 'components/LoadingAnimation'
import { track } from 'utils/track';
import log from 'utils/logging'
export default function AuthWallHOC(WrappedComponent) {


  return function _AuthWallHOC(props) {
    const userReady = useSelector((state : any) => state.userData.isReady);
    const profileReady = useSelector((state : any) => state.profileData.isReady);
    const cartReady = useSelector((state : any) => state.mainCartData.isReady)

    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      log.info('[AuthWallHOC] in mounting function')
      track(`[AuthWallHOC] in mounting function`, {url: Router.asPath})
      Auth.currentAuthenticatedUser()
        .then(user => {
          setIsAuth(true);
        })
        .catch(err => {
          log.info(`[AuthWallHOC] auth check failed`, {url: Router.asPath})
          track(`[AuthWallHOC] auth check failed`, {url: Router.asPath})

          Router.replace(
          {
            pathname: pageLinks.Auth.url,
            query: { currentPage: Router.asPath }
          }, 
          {
            pathname: pageLinks.Auth.url,
            query: { currentPage: Router.asPath }
          });
        });
    }, [])

    
    let toRender = <div>
      {
        false &&
        <>
              isAuth: {JSON.stringify(isAuth)} <br />
              userReady: {JSON.stringify(userReady)}  <br />
              profileReady: {JSON.stringify(profileReady)}  <br />
              cartReady: {JSON.stringify(cartReady)}  <br />
        </>

      }

    </div>;
    if(isAuth && userReady && profileReady && cartReady){
      toRender = <WrappedComponent {...props} /> 
      track(`[AuthWallHOC] auth check passed`, {url: Router.asPath})
    }
    
    return (
      toRender
    );

  };
}

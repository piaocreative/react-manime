import React, { Fragment, useEffect, useState } from 'react';

import { Hub} from '@aws-amplify/core';
import { completeFederatedSignIn } from '../../utils/authUtils';


import log from '../../utils/logging';

import SignUp from './SignUp';
import { pageLinks } from '../../utils/links';
type FederatedProps = {
  callback: Function
  back: Function,
  track: Function,
  currentPage?: string,
  isLoading?: boolean,
  providers?: string[],
}

export default function ({ callback, back, track }: FederatedProps) {

  const [user, setUser] = useState<any>({})
  const [signInReady, setSignInReady] = useState(false)
  const [customState, setCustomState] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [identityMissmatch, setIdentityMissmatch] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("/")

  useEffect(()=>{

    if(signInReady){

      log.info("ready to perform federated sign in with custom state", {customState})
      performFederatedSignIn()
    }
  }, [signInReady])

  async function performFederatedSignIn() {
    try {

      
      _track("[start]")
      let _currentPage = undefined;
      let expectedIdentity = undefined;

      // if the custom state is not defined then the url came from a desktop transfer
      // those always go to checkout, so set that as the current page
      if(customState && customState !== "DONOTUSE" ){
      // DONOTUSE is when the custom state is garbled ... this results from a user 
      // using the back button during the flow at which point we lose the customState
      // data so the best we can do is send to home page after sign in. 

        const thesplit = customState.split("&")
        _currentPage = thesplit[0];

        if(thesplit.length > 1 ){
          expectedIdentity = thesplit[1];
        }
      }


      const result = await completeFederatedSignIn();

      log.verbose("result from sign in ", result)

      if(result.complete === false){

        const identities = JSON.parse(result.user?.attributes?.identities)

        const names = result.user?.attributes?.name?.split(" ")
        const email = result.user?.attributes?.email
        const providerId = result.user?.username
        let provider = identities?.length >0 ? identities[0].providerName : " "
        provider = provider.toLowerCase();
        const firstName = names?.length >= 1 && names[0]
        const lastName = names?.length >= 2 && names[names.length-1]
        const identityId = result.credentials.identityId
        setUser({firstName, lastName, provider, providerId, email, identityId, currentPage: _currentPage})

        setCurrentPage(_currentPage);
        if(expectedIdentity){
          setIdentityMissmatch(identityId !== expectedIdentity)     
        }

      
        

        setIsLoading(false)
      }else if(result.success===true){
        // done with sign in can go to next page
        _track("[complete]", {socialResult: "success-signin"})
        result['currentPage'] = _currentPage
        result['expectedIdentity'] = expectedIdentity;
        result['type']="signin"
        callback(result)
      }else {
        _track("[complete]", {socialResult: `error-${result.error?.code ? result.error.code : "cognito"}`})
        callback(result)
      }
    } catch (error) {
      _track('[complete]', {socialResult: `error-${error.code ? error.code : "cognito"}`, error})
      callback({error})
      log.error("problems with federated sign in " + error, {error})
    }
  }

  function _track(message, callbackInput=undefined){
    track(`[social]${message}`, {...callbackInput})
  }




  function hubListener(input){
    const {payload: {event, data}} = input

    switch (event) {

      case "signIn_failure":

        const matches = data?.message?.match(/expired/)
        _track('[start]')
        if(matches){
          _track(`[complete]`, {socialResult: 'error-expired'})    
          callback({error: {message: "You followed a link that has expired. Please sign in directly.", code: "EXPIRED"}})
        }else{
          _track(`[complete]`, {socialResult: 'error-signin'})    
          callback({error: {message: "There was a problem signing you in via Social. Please try again.", code: "GENERAL"}})
        }
        break;
      
      case "signIn":

          // this will handle any back buttons that are hit during the flow
          setTimeout(()=>{

            setSignInReady(true)

          }, 2000)

        break;
      case "signOut":
        //console.log("why is sign out happening")
        break;
        // this event is a result of a a back forth action and at this point we've lost the current page. 

      case "customOAuthState":
        
        let state = "/";
        
        try{ 
          state = atob(data);
        }catch(error) {
          // no op
        }
        if(state.indexOf("/") === -1){
          state = "DONOTUSE"
        }

        setCustomState(state)
        setSignInReady(true)
        break;

    }
  }

  function wrappedCallback(input){
    input.currentPage = currentPage;
    const resultString = input.success ? "success-signup" : "error-signup"
    input.type="signup"
    _track('[complete]', {signupResult: resultString})
    callback(input);
  }
  useEffect(() => {

    
    Hub.listen("auth", hubListener);
    return ()=>{
      Hub.remove("auth", hubListener)
    }
  }, [])


  return (
    <SignUp back={back} callback={wrappedCallback} isLoading={isLoading} firstName={user.firstName} lastName={user.lastName} phoneNumber={user.phoneNumber} 
      email={user.email} providerid={user.providerId} provider={user.provider} identityId={user.identityId} identityError={identityMissmatch}/>
  );
}

import React, { useState, } from 'react'
import {useSelector} from 'react-redux'
import AuthWall from 'components/AuthWallHOC';
import  { useRouter } from 'next/router'
import {trackWithGtm} from 'utils/track'
import { useEffect } from 'react';
import PageWrapper,{ ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';

function SubscriptionFordwarder(props) {

  const userData = useSelector((state : any)=>state.userData)
  const [hasMounted, setHasMounted] = useState(false)
  const [error, setError] = useState<string>();
  const router = useRouter();
  const match = process.browser ? router.asPath.match(/step=(?<paramStep>\w+)&?/) : undefined

  async function mount(){
    _track('[mount] mounting for subscription forwarder')
    setHasMounted(true)
    
  }

  useEffect(()=>{

    let match = router.asPath.match(/[?&]planCode=([^&]+).*$/)
    let planCode = match && match.length >1 && match[1] || undefined; 

    if(!planCode){
      setError("No Plan Code selected");
      return;
    }
    let { identityId: userId, email, name: { firstName, lastName } } = userData;
    userId = encodeURIComponent(userId);
    email = encodeURIComponent(email);
    firstName = encodeURIComponent(firstName);
    lastName = encodeURIComponent(lastName)
    const encPlanCode = encodeURIComponent(planCode);

    window.location.replace(`${process.env.SUBSCRIPTION_SIGNUP}/${encPlanCode}/${userId}?email=${email}&first_name=${firstName}&last_name=${lastName}`);
  },[])

  function _track(message, callbackInput=undefined){
    trackWithGtm(`[Subscription]${message}`, { userData, ...callbackInput})
  }

  return (
    
    <div>
      <div>
        {
          error
        }
      </div>
    </div>
     


  )


}


export default ManimeStandardContainer(AuthWall(SubscriptionFordwarder));

export const getStaticProps = async ({ res, req }) => await getGlobalProps();

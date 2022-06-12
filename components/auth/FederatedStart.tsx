import { useEffect } from 'react';

import { startFederatedSignIn} from '../../utils/authUtils'

export default function({callback, providers, currentPage}: {callback: Function, providers: string[], currentPage?: string}){

  useEffect(()=>{
    if(providers && providers.length > 0){
      startFederatedSignIn(providers[0], currentPage);
    }
  }, [providers])

  return <div></div>
}
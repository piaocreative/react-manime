import { useEffect, useState } from 'react'
import Link from 'next/link'
import { trackFunnelActionProjectFunnel,  } from '../../utils/track'
import { getPresigned } from 'api/util'
import checkMobile from '../../utils/checkMobile'
import { Auth } from '@aws-amplify/auth';
import log from '../../utils/logging'
import LoadingAnimation from '../LoadingAnimation'
import { A, HalfBox, ImgBox, Line, BackBox } from './styled';
import Box from '../styled/Box';
import Router from 'next/router';
import { pageLinks } from '../../utils/links'
declare var mixpanel;

export default function LoginByLinkPage(params) {

  const { callback } = params
  const [isLoading, setIsLoading] = useState(true)
  const [hasPriorAuth, setHasPriorAuth] = useState(false)

  useEffect(() => {
    signInByLink()
  }, [])

  async function signInByLink() {
    const url = new URL(window.location.href);
    const c = url.searchParams.get('c');
    const id = url.searchParams.get('id');
    const e = url.searchParams.get('e');

    const hash = window.location.hash;

    let email;



    // NOTE: get email to track beginning of pre-signed link usage
    try {
      if (e) email = Buffer.from(e, 'base64').toString();
      if (email) {

        trackFunnelActionProjectFunnel('Immediately track signInByLink email');

        mixpanel.funnel.identify(email);
        mixpanel.funnel.people.set_once({ '$name': email, '$email': email });
        mixpanel.funnel.register({
          userid: email
        });
        trackFunnelActionProjectFunnel('Immediately track signInByLink email');
        // NOTE: this is for variant c to pre-fill the email form
        // setState({ email });
      }
    } catch (err) {
      log.error('[LogInByLink][signInByLink] try email ' + err, { err });
    }

    // NOTE: Auth Flow Tracking - Pre-authenticated Sign In Enter per document
    // https://docs.google.com/spreadsheets/d/1qeUqsEDHUtF_pC44jU_dgpyfcDQAX72PxvqxHXRTvLU/edit#gid=0

    // NOTE: is pre-signed and email is valid from url
    if ((hash || c || id) && email) {
      if (checkMobile()) {
        trackFunnelActionProjectFunnel('Received link on mobile and opened it - Mobile');
      } else {
        trackFunnelActionProjectFunnel('Pre-authenticated Sign In Enter - Desktop');
      }
    }

    if (id) {
      const presignedData = await getPresigned(id);
      if (presignedData) {

        let temp = presignedData.text;
        try {
          const currentUser = await Auth.currentAuthenticatedUser();
          // if still here the user is authed pull off the current page and go there
          setIsLoading(false)
          const tempPath = temp+ "&"
          const match = tempPath.match(/currentPage=(?<currentPage>[\S]+?)[&#]/)
          let _currentPage = match?.groups?.currentPage
          if(_currentPage){
            _currentPage = decodeURIComponent(_currentPage)
          }
          Router.replace(_currentPage);
          return;
        } catch (error) {
          // no op
        }

        let urlObject = new URL(temp);
        // looks like if here then successful?
        window.location.replace(temp);
      }else {
        callback({error: {message: `Oops! The secure link you used has expired.\nRequest a new one or sign in to your account [here](${process.env.APP_URL}${pageLinks.Profile.Account.url})`}})
      }
    } else if (c) {
      try {

        let email = url.searchParams.get('e');
        email = Buffer.from(email, 'base64').toString();
        let decodedCode = Buffer.from(c, 'base64').toString();
        let cognitoUser = null;
        cognitoUser = await Auth.signIn(email);
        cognitoUser = await Auth.sendCustomChallengeAnswer(cognitoUser, decodedCode);
        // log.info(cognitoUser);

        // await callHydrateUserData();
        // loading(false);

        // trackFunnelActionProjectFunnel('A. Log In Completed - Pre-Authenticated Link');
        trackFunnelActionProjectFunnel('A. Log In Completed');

      } catch (err) {
        log.error('[LogInByLink][signInByLink] caught error "if c" ' + err, { err });
      }
    }
  }

  function signOut(){
    callback({signOut: true})
  }

  const output = isLoading ?
    <LoadingAnimation isLoading={true} background={'#F9F9F9'} size={checkMobile() ? 250 : 350} />
    :
    (
      hasPriorAuth ?
        <div style={{lineHeight: '23px', paddingTop: '20px'}}>
          You followed a link to complete your nail scan but are already signed in on this device. <p />
          If you are signed in to the same account you can click <Link href="/checkout"><span style={{color: 'blue'}}>checkout</span></Link> to complete your profile. <p />
          If you created a new account on your desktop, you can <Link href="/auth?step=signOut"><span style={{color: 'blue'}} onClick={signOut}>sign out</span></Link> and follow the link again
          </div>
        :
        <div></div>
    )

  return (
    <>
      <HalfBox height={['100px', '400px']}>
        <ImgBox height='250px' pb={['80px', 0]}>
          <Box
            display='flex'
            alignItems='center'
            textAlign='center'
            height='100%'
            px={4} >
            <Box
              width={1}
              flex='1 0 auto'
              px={3}
              mt={['-50px', 0]}
              fontFamily='avenirBook'
              fontSize={['18px', '35px']}
              letterSpacing='2px'
              fontWeight='500'
              style={{ cursor: 'default' }}>
              <span style={{textTransform: "uppercase"}}>
                {
                  hasPriorAuth ?
                  "Houston, we have a problem" :
                  "EXCITED TO GET TO KNOW YOU"
                }
              </span>
            </Box>
          </Box>
        </ImgBox>
      </HalfBox>
      <HalfBox
        decoration
        p={['0 12px', 0]} position='relative' height={'400px'}
      >

        <Box p={[3, 5]} background='#F9F9F9' height={[388, 356]}>
          { output }
        </Box>
      </HalfBox>
    </>
  )

}


import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Box from '../../styled/Box';
import { DarkButton, GrayButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import youtubeLinks from '../../../utils/youtubeLinks'
import { NORMAL_RATE_CREDIT } from '../../../constants';

const A = styled.a`
  cursor: pointer;
  text-decoration: underline;
`;

const GrayPanel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e5e5e1;
  width: 100%;
  padding: 8px 12px;
  text-align: center;
  font-size: 12px;
  min-height: 44px;
`;


const list = [
  {
    number: 1,
    title: 'SCAN YOUR NAILS',
    pediTitle: 'SCAN YOUR TOENAILS',
    text: <>Your nail size is unique. Scan your mani and we <br /> will custom size your stick on gels.</>,
    pediText: <>Your toenail size is unique. Scan your pedi and <br /> we will custom size your stick on gels.</>,
    label: 'Start Scan',
    nextPath: pageLinks.GuidedFitting.url,
    nextPediPath: `${pageLinks.PediFitting.url}?returnUrl=${pageLinks.Profile.Account.url}`
  },
  {
    number: 2,
    title: 'SHOP YOUR MANI',
    text: <>Designs for any occasion. Check our exclusive <br />collaborations with the world’s top designers.</>,
    label: 'SHOP MANI',
    nextPath: pageLinks.SetupManiDesign.url,
    nextPediPath: pageLinks.SetupPediDesign.url
  },
  {
    number: 3,
    title: 'RATE YOUR FIT',
    text: <>Rate your fit and get $5 ManiMoney. Your feedback <br /> will help us improve the sizing of all your future orders.</>,
    waitingText1: <>While your order is being produced, <br /> check our <a style={{textDecoration: 'underline'}} href={youtubeLinks.HowToApplyLongVideo} target='_blank'>how to</a> videos.</>,
    waitingText2: <>While your order arrives, <br /> check our <a style={{textDecoration: 'underline'}} href={youtubeLinks.HowToApplyLongVideo} target='_blank'>how to</a> videos.</>,
    label: 'RATE MY MANI FIT',
    nextPath: `${pageLinks.Refit.url}?profileType=Manis`,
    nextPediPath: `${pageLinks.Refit.url}?profileType=Pedis`
  },
  {
    number: 0,
    title: `THANKS FOR YOUR RATING!`,
    text: <>Your fit is improved with your feedback, and we keep <br /> it for all future orders. Reach out to <A href={'mailto:care@manime.co'}>care@manime.co</A> <br /> for any questions about your fit.</>,
    label: 'CHECK NEW DESIGNS',
    nextPath: pageLinks.NewProduct.url,
    nextPediPath: pageLinks.NewProduct.url,
  },

];

const Container = styled(Box)`
  position: relative;
  display: grid;
  grid-template-columns: auto;
  grid-gap: 20px;
  background-color: #f6f4ee;
  margin: -24px 16px 0;
  padding: 24px 0px;
  text-align: center;

  @media (min-width: 768px) {
    background-color: #fff;
  }
`;

const NumberBox = styled.span`
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => props.theme.colors.teal};
  color: ${props => props.theme.colors.white};
  letter-spacing: 0;
  font-size: 14px;
  font-family: avenirHeavy;
`;
// TODO: move later
const STEP_ORDERED = 2;

const InstructionPanel = ({profileStep=0, isManiProfile, profileOverview}) => {
  const index = profileStep < 0 ? 0: profileStep;
  const instruction = list[index];
  const title = !isManiProfile? (instruction.pediTitle || instruction.title.replace('MANI', 'PEDI')) : instruction.title;
  let label = isManiProfile ?
  instruction.label:
  instruction.label.replace('MANI', 'PEDI');
  let isWaiting = false;
  let isRefit = false;

  if (profileStep === STEP_ORDERED && !profileOverview?.hasDeliveredOrder) {
    isWaiting = true;
  } else if (profileStep === STEP_ORDERED) {
    isRefit = true;
  }

  const text = isWaiting?
    (profileOverview?.trackingUrl ? instruction.waitingText2: instruction.waitingText1) 
    : !isManiProfile? (instruction.pediText || instruction.text): instruction.text;

  const redirectHandler = () => {

    const maniNextPath =  `${instruction.nextPath}`;

    const groupOrderId = profileOverview?.lastGroupOrderId;
    let pathname = isWaiting ? pageLinks.SetupDesign.url:
      isManiProfile ? maniNextPath:
      instruction.nextPediPath;
    if (isRefit) {
      pathname=`${pathname}&groupOrderId=${groupOrderId}`;
    }
    Router.push(pathname);
  };

  return (
    <Container>
      <Box display='flex' alignItems='center' justifyContent='center' letterSpacing='4px' fontSize='12px' fontFamily='avenirHeavy' >
        {instruction.number ? <NumberBox>{instruction.number}</NumberBox>: null}{title}
      </Box>
      <Box fontSize='12px'>{text}</Box>
      <Box px='32px' width={1} display='grid'>
        {isWaiting &&
        (profileOverview?.trackingUrl ?
        <GrayPanel>
          Your 1st order is on the way <a style={{textDecoration: 'underline', marginLeft: 8}} href={profileOverview?.trackingUrl} target='_blank'>Track order</a>
        </GrayPanel>:
        <GrayPanel>
          Your custom gels are being produced <br />Tracking info coming soon
        </GrayPanel>
        )
        }
        {!isWaiting &&
        <DarkButton onClick={redirectHandler} style={{textTransform: 'uppercase'}}>
          {label}
        </DarkButton>
        }
      </Box>
    </Container>
  );
};

export default InstructionPanel;
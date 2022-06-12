import React from 'react'
import styled from 'styled-components';
import {pageLinks} from '../../../utils/links'
import Box from '../../styled/Box';
import log from '../../../utils/logging';
import constants from '../../../constants';

const Container = styled(Box)` 
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  flex: 1 2;

  padding-left: 15px;
  padding-right: 15px;
  margin-top: -30px;
  @media (min-width: 1024px) {

    padding-left: 0px;
    padding-right: 0px;
    margin-top: 0px;
  }
`

const StepBox = styled(Box)` 

  display: flex;
  flex-direction: column;
  padding-top: 15px;
  padding-bottom: 15px;
  align-items: center;
  justify-content: flex-start;

  width: calc(50% - 40px);
  @media (min-width: 1024px) {
    flex-direction: row;
    padding-left: 10px;
    
  }

`
const RowBox = styled(StepBox)` 
width: 100%;
@media (min-width: 1024px) {
    flex-direction: column;

    
  }
`
const Icon = styled.img`
  padding-bottom: 10px;
  object-fit: cover;
`;

const Img = styled.img`
  width: 256px;

  object-fit: cover;


  @media (min-width: 1024px) {
    width: 350px;

    display: flex;
    
  }
`;

const ImgBox = styled(Box)` 
  background-size: cover;
  background-position: right;
  background-repeat: no-repeat;
  background-image: url(${props => props.srcMobile});


  height: 175px;
  flex: 1 0 100%;

  margin-bottom: 30px;

  @media (min-width: 1024px) {
    background-image: url(${props => props.src});
    background-size: cover;
    flex: 1 0 40%;
    margin-left: 10px;
    margin-right: 10px;

  }
`


const StepText = styled(Box)` 
  font-family: AvenirBook;
  font-style: italic;
  font-size: 12px;
  text-align: left;
  padding-left: 10px;
`

const CTABox = styled(Box)` 
  padding: 20px;
  height:  100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export default function GiftConfirmation({ toName, productImage }: { toName: string, productImage: string }) {

  const truck = '/static/icons/giftTruck.svg'
  const letter = '/static/icons/giftLetter.svg'
  const manis = '/static/icons/giftManis.svg'
  const outline = '/static/icons/giftOutline.svg'
  const refer = '/static/images/giftRefer.jpg'
  const shopAll = '/static/images/giftShopAll.jpg'
  const referMobile = '/static/images/giftReferMobile.jpg'
  const shopAllMobile = '/static/images/giftShopAllMobile.jpg'

  return (
    <Container>
      <RowBox>
        <div style={{ color: 'white', textTransform: 'uppercase', fontFamily: "AvenirHeavy", fontSize: '12px', letterSpacing: '4px' }}>Order Confirmation</div>
        <Box width={['75%', '75%', '100%']} style={{ color: '#2c4349', textAlign: 'center', textTransform: 'uppercase', fontFamily: "AvenirBook", fontSize: '28px', paddingTop: '20px', letterSpacing: '1.56px' }}>Thanks for gifting ManiMe!</Box>
        <div style={{ color: '#2c4349', fontFamily: "AvenirBook", fontSize: '12px', lineHeight: '10px', paddingTop: '7px' }}>{toName} is going to love their custom-made stick on gels!</div>
        <Img src={productImage} alt='gift' />
      </RowBox>
      <StepBox>
        <Icon src={truck} alt="truck" />
        <StepText>Please allow 1 week for delivery.</StepText>
      </StepBox>
      <StepBox>
        <Icon src={letter} alt="letter" />
        <StepText>We’ll include your personalized message on a postcard within the gift kit. </StepText>
      </StepBox>
      <StepBox>
        <Icon src={manis} alt="manis" />
        <StepText>The Gift Kit will include a ManiMe gift card, an assortment of nail care essentials, and an exclusive pouch.</StepText>
      </StepBox>
      <StepBox>
        <Icon src={outline} alt="outline" />
        <StepText>Redeeming the gift is easy - the recipient will get their custom-made stick on gels delivered!</StepText>
      </StepBox>

      <ImgBox src={refer} srcMobile={referMobile}>
        <CTABox >
          <Box display={"flex"} flexDirection={"column"}>
          <Box fontFamily={"AvenirHeavy"} style={{textTransform: 'uppercase'}}>Give ${constants.referral.NORMAL_REFERREE_CREDIT}, Get ${constants.referral.NORMAL_REFERRER_CREDIT}</Box>
            <Box fontFamily={"AvenirBook"} fontSize={"9px"}>for every friend that purchases for the first time.</Box>
          </Box>
          <Box>
            <a href={pageLinks.Profile.Friends.url} style={{textDecoration: 'underline', cursor: 'url'}}>REFER NOW</a>
          </Box>
        </CTABox>
      </ImgBox>
      <ImgBox src={shopAll} srcMobile={shopAllMobile}>
        <CTABox >
          <Box display={"flex"} flexDirection={"column"}>
            <Box fontFamily={"Avenir"} fontSize={"12px"} letterSpacing={"1.3px"}>DESIGNS FOR ANY OCCASION</Box>

          </Box>
          <Box>
            <a href="/shop" style={{textDecoration: 'underline', cursor: 'url'}}>EXPLORE NOW</a>
          </Box>
        </CTABox>
      </ImgBox>
    </Container>
  )
}
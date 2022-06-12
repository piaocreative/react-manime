import Box from 'components/styled/Box';
import style from '@styles/subscription/redeem.module.css'
import { A, HalfBox, ImgBox, Line } from 'components/auth/styled';
import LoadingAnimation from 'components/LoadingAnimation';

export default function LoadingScreen(props){
  return (  <div className={style.loadingContainer}>
    <HalfBox m="0" p="0" height={['40vh', '40vh', '80vh']}>
      <ImgBox height="200px" pb={['80px', 0]}>
        <Box
          position="relative"
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          height="100%"
          px={4}
        >
          <Box
            width={1}
            // flex='1 0 auto'
            my="auto"
            fontFamily="sansSerif"
            letterSpacing="2px"
            fontSize={['18px', '35px']}
            fontWeight="500"
            px={'20px'}
            style={{ cursor: 'default', textTransform: 'uppercase' }}
          >
            Please wait while we prepare your subscription
          </Box>
        </Box>
      </ImgBox>
    </HalfBox>

    <LoadingAnimation isLoading={true} size={'350px'} height={'100%'}/>


    

  </div>)
}
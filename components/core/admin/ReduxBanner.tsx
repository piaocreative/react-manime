import {useSelector} from 'react-redux'

export default function ReduxBanner({height=30}){
  const isUserDataReady = useSelector((state : any) => state.userData.isReady);
  const isProfileReady = useSelector((state : any) => state.profileData.isReady);
  const isCartReady = useSelector((state : any) => state.checkoutData.isReady);

  return (
    <>
    <div style={{display: 'flex', width: '100%', position: 'fixed', height: `${height}px`, top: '30px', backgroundColor:'#50b8cc', color: 'black', alignItems: 'center', zIndex: 100, gap: '5px'}}>
      <div style={{flex: 1, textAlign: 'center'}}>UserData: {JSON.stringify(isUserDataReady)}</div>
      <div style={{flex: 1, textAlign: 'center'}}>ProfileData: {JSON.stringify(isProfileReady)}</div>
      <div style={{flex: 1, textAlign: 'center'}}>Cart: {JSON.stringify(isCartReady)}</div>
    </div>

    </>
  )
}

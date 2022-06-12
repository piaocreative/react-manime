// iPhone model checks.

export function isApplePortable(){
  if(!navigator){
    return false
  }
  return  /iPhone|iPad/i.test(navigator.userAgent)
}
export function isMobileDevice(){
  return navigator && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}
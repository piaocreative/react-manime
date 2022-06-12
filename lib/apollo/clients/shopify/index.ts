import shopifyConfig from './config'
import initApollo from '../../init-apollo'

let client = undefined
function init(){
  client = client || initApollo({config: shopifyConfig})

  return client
}

export default init();
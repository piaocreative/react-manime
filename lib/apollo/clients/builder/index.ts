import builderConfig from './config'
import initApollo from '../../init-apollo'

let client = undefined
function init(){
  client = client || initApollo({config: builderConfig})

  return client
}

export default init();
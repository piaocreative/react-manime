import React from 'react'
import initApollo from './init-apollo'
import Head from 'next/head'
import { getDataFromTree } from "@apollo/client/react/ssr"
import log from '../../utils/logging'
import shopifyClient from './clients/shopify'

import {warmBuilder} from '../builder'

export default App => {
  return class Apollo extends React.Component {
    static displayName = 'withApollo(App)'
   

    constructor (props) {
      super(props)
      shopifyClient.cache.restore(props.apolloState)
    }

    render () {
      warmBuilder();
      return <App {...this.props} apolloClient={shopifyClient} />
    }
  }
}

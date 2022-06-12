import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import fetch from 'isomorphic-unfetch'


let clients = {}

type ApolloConfig = {
  headers?: any,
  possibleTypes?: any,
  uri: string
}

function create (config: ApolloConfig, initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient

  const {possibleTypes, headers, uri} = config
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)

    link: new HttpLink({
      headers, 
      // Additional fetch() options like `credentials` or `headers`
      uri,  // Server URL (must be absolute)
      credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      // Use fetch() polyfill on the server
      fetch: !process.browser && fetch
    }),
    cache: new InMemoryCache(possibleTypes).restore(initialState || {})
  })
}


export default function initApollo ({config, initialState} : {config: ApolloConfig, initialState?: any}) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(config, initialState)
  }

  // Reuse client on the client-side
  if (!clients[config.uri]) {
    clients[config.uri] = create(config, initialState)
  }

  return clients[config.uri]
}

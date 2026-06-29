import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const wsLink = typeof window !== 'undefined'
  ? new GraphQLWsLink(createClient({
      url: `ws://${window.location.host}/api/graphql`,
      connectionParams: () => {
        const token = localStorage.getItem('token')
        return {
          authorization: token ? `Bearer ${token}` : '',
        }
      }
    }))
  : null

const splitLink = typeof window !== 'undefined' && wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  : httpLink

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

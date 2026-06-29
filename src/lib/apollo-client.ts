import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

const httpLink = createHttpLink({
  uri: '/api/graphql',
  headers: {
    authorization: typeof window !== 'undefined' 
      ? `Bearer ${localStorage.getItem('token')}` 
      : '',
  },
})

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
})

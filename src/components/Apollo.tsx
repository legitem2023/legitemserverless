"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, split, from, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
// Server-safe Apollo Client creation
let apolloClient: ApolloClient<any> | null = null;

function createIsomorphicLink() {
  if (typeof window === 'undefined') {
    // Server-side HTTP link
    console.log(process.env.NEXT_PUBLIC_SERVER_LINK);
    return new HttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER_LINK,
      credentials: 'include'
    });
  }

  // Client-side links
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK,
    credentials: 'include'
  });

  const wsLink = new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_WS_SERVER_LINK?.replace(/^http/, 'ws') || '',
    options: { reconnect: true }
  });

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );
}

function createApolloClient() {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // Error handling logic
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, createIsomorphicLink()]),
    cache: new InMemoryCache()
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) _apolloClient.cache.restore(initialState);
  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export const Apollo = ({ children }: { children: React.ReactNode }) => {
  const client = useMemo(() => initializeApollo(), []);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, split, from } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';

export const Apollo = ({ children }: { children: React.ReactNode }) => {
  // Memoize all links to prevent recreation on re-renders
  const httpLink = useMemo(() => createUploadLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK,
    credentials: 'include',
  }), []);

  const wsLink = useMemo(() => new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_WS_SERVER_LINK?.replace(/^http/, 'ws'),
    options: { reconnect: true },
  }), []);

  const errorLink = useMemo(() => onError(({ graphQLErrors, networkError }) => {
    // Error handling logic
  }), []);

  const link = useMemo(() => from([
    errorLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      wsLink,
      httpLink
    ),
  ]), [errorLink, wsLink, httpLink]); // Dependencies are memoized, so stable

  const client = useMemo(() => new ApolloClient({
    cache: new InMemoryCache(),
    link,
  }), [link]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

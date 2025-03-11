"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, split, from } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useMemo } from 'react';
import { onError } from '@apollo/client/link/error';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'; // For file uploads

// Apollo Provider Component
export const Apollo = ({ children }: { children: React.ReactNode }) => {
  // HTTP link for queries and mutations
  const httpLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_SERVER_LINK, // GraphQL HTTP endpoint
    credentials: 'include', // Send cookies along with requests
  });

  // WebSocket link for subscriptions
  const wsLink = new WebSocketLink({
    uri: process.env.NEXT_PUBLIC_WS_SERVER_LINK?.replace(/^http/, 'ws'), // Replace http with ws for WebSocket link
    options: {
      reconnect: true, // Automatically reconnect if the connection is lost
    },
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    }
    if (networkError) {
      // console.error(`[Network error]: ${networkError}`);
    }
  });

  // Link splitting based on operation type (query/mutation or subscription)
  const link = from([
    errorLink,
    split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink, // Use WebSocket link for subscriptions
      httpLink // Use HTTP link for queries and mutations
    ),
  ]);

  // Apollo Client setup with cache and link
  const client = useMemo(() => {
    return new ApolloClient({
      cache: new InMemoryCache(),
      link, // Use the link created above
    });
  }, [link]);

  // Return the ApolloProvider wrapping your children components
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

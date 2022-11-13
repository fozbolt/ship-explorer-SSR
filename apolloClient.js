import { onError } from "@apollo/client/link/error";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink([
  errorLink,
  new HttpLink({ uri: "https://api.spacex.land/graphql/" }),
]);

export const apolloClient = () => {
  return new ApolloClient({
    link: httpLink.options[1],
    cache: new InMemoryCache({}),
  });
};

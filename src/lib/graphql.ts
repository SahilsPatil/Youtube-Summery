import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(import.meta.env.VITE_NHOST_URL, {
  headers: {
    'x-hasura-admin-secret': import.meta.env.VITE_HASURA_ADMIN_SECRET,
  },
});
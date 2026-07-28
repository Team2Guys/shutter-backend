import { ApolloServer } from "@apollo/server";

import { env } from "#config/index.js";
import { typeDefs, resolvers } from "#modules/index.js";

const formatError = (error) => {
  if (env.NODE_ENV !== "production") {
    console.error("GraphQL Error:", error.message);
  }
  const code = error.extensions?.code;
  return {
    message: error.message || "An unexpected error occurred.",
    path: error.path || [],
    code,
    // Kept nested as well so Apollo Client sees it at the standard
    // `graphQLErrors[i].extensions.code` location (the dashboard uses it to
    // force a logout on UNAUTHENTICATED).
    extensions: { code },
  };
};

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  introspection: true,
  includeStacktraceInErrorResponses: env.NODE_ENV !== "production",
});

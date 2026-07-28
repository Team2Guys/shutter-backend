import { GraphQLError } from "graphql";

import { env } from "#config/index.js";

const { NODE_ENV, BACKEND_URL } = env;

/** HTTP status → GraphQL `extensions.code`, so clients can branch on the cause. */
const ERROR_CODE_BY_STATUS = {
  400: "BAD_USER_INPUT",
  401: "UNAUTHENTICATED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
};

/**
 * Normalize a thrown error into a GraphQLError that carries an
 * `extensions.code`. A GraphQLError already sets its own code (the auth guards
 * in verify.lib.js do), so it passes straight through — re-wrapping it would
 * lose the code and everything would surface as INTERNAL_SERVER_ERROR.
 */
const toGraphQLError = (error) => {
  if (error instanceof GraphQLError) return error;

  const status = error.status || error.statusCode || 500;
  const code = ERROR_CODE_BY_STATUS[status] || "INTERNAL_SERVER_ERROR";
  return new GraphQLError(error.message, {
    extensions: { code, http: { status } },
    originalError: error,
  });
};

/**
 * Wrap a resolver so any thrown / rejected error becomes a GraphQLError with a
 * status-derived error code (preserving the original status where available).
 */
export const handlePromise =
  (fn) =>
  (...args) => {
    try {
      const result = fn(...args);
      if (result && typeof result.then === "function") {
        return result.catch((error) => {
          throw toGraphQLError(error);
        });
      }
      return result;
    } catch (error) {
      throw toGraphQLError(error);
    }
  };

/** Convert any string into a url-safe slug. */
export const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getServerInfo = () =>
  `
⚙️  Shutters Backend (Express + Apollo + Prisma)
- Environment: ${NODE_ENV}
➜  GraphQL: ${BACKEND_URL}/graphql
`.trim();

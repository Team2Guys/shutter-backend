import { GraphQLError } from "graphql";

/**
 * GraphQL errors carry a machine-readable `extensions.code` (surfaced by the
 * Apollo `formatError` hook) so the dashboard can tell "your session expired"
 * (UNAUTHENTICATED → force a logout) apart from "you lack this permission"
 * (FORBIDDEN → just show the message).
 */
const authError = (message) =>
  new GraphQLError(message, {
    extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
  });

const forbiddenError = (message) =>
  new GraphQLError(message, {
    extensions: { code: "FORBIDDEN", http: { status: 403 } },
  });

const requireAuth = (context) => {
  // A missing user also covers an expired/invalid token: the context builder
  // swallows the verify failure and leaves `user` null.
  if (!context.user) throw authError("Session expired. Please sign in again.");
};

/**
 * Resolver guards. Compose like:
 *   verify.permission('canAddCategory')(resolverFn)
 * SUPER_ADMIN bypasses every permission check.
 */
export const verify = {
  access: (resolver) => (parent, args, context, info) => {
    requireAuth(context);
    return resolver(parent, args, context, info);
  },

  role: (authorizedRoles) => (resolver) => (parent, args, context, info) => {
    requireAuth(context);
    if (!authorizedRoles.includes(context.user.role)) {
      throw forbiddenError(
        `Access denied: requires one of ${authorizedRoles.join(", ")}.`
      );
    }
    return resolver(parent, args, context, info);
  },

  permission:
    (permissionKey) => (resolver) => (parent, args, context, info) => {
      requireAuth(context);
      const { role, permissions = [] } = context.user;
      if (role === "SUPER_ADMIN") {
        return resolver(parent, args, context, info);
      }
      if (!permissions.includes(permissionKey)) {
        throw forbiddenError(
          `Access denied: missing permission "${permissionKey}".`
        );
      }
      return resolver(parent, args, context, info);
    },
};

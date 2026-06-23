import createError from 'http-errors';

export const verificationUtils = {
  verifyAccess: (resolver) => (parent, args, context, info) => {
    if (!context.user) throw createError(401, 'Missing access token.');
    return resolver(parent, args, context, info);
  },

  verifyRole:
    (authorizedRoles) => (resolver) => (parent, args, context, info) => {
      if (!context.user) throw createError(401, 'Authentication required.');
      if (!authorizedRoles.includes(context.user.role))
        throw createError(
          403,
          `Access denied: one of ${authorizedRoles.join(', ')} role required.`
        );
      return resolver(parent, args, context, info);
    }
};

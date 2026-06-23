import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { env } from '#config/index.js';

const { JWT_SECRET } = env;

export const tokenUtils = {
  generate: (payload, tokenType) => {
    const options = {
      algorithm: 'HS256'
    };

    switch (tokenType) {
      case 'verificationToken':
        options.expiresIn = '5m';
        break;
      case 'accessToken':
        options.expiresIn = '10h';
        break;
      case 'passwordResetToken':
        options.expiresIn = '5m';
        break;
      default:
        throw createError(400, 'Invalid token type specified.');
    }

    if (!JWT_SECRET) {
      throw createError(500, 'JWT secret key is undefined');
    }

    return jwt.sign(payload, JWT_SECRET, options);
  },

  verify: (token) => {
    if (!JWT_SECRET) throw createError(500, 'JWT Secret is undefined');

    const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw createError(401, 'Invalid or expired token');
      }

      return decoded;
    });

    return decoded;
  },

  decode: (token) => {
    const decoded = jwt.decode(token, (err, decoded) => {
      if (err) {
        throw createError(401, 'Invalid or expired token');
      }

      return decoded;
    });

    if (!decoded) throw createError(401, 'Invalid token');

    return decoded;
  }
};

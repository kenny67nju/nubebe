// JWT utility functions
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { AuthTokenPayload } from '../types/index.js';

export const generateToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
};

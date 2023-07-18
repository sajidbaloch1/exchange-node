import dotenv from "dotenv";

dotenv.config();

const { env } = process;

/**
 * Application configs
 *
 * Add all the .env variables to this object
 *
 * This will help with autocomplete suggestions
 *
 */
export const appConfig = {
  NODE_ENV: env.NODE_ENV,

  PORT: env.PORT,

  SALT_ROUNDS: parseInt(env.SALT_ROUNDS, 10),
  JWT_TOKEN_PREFIX: env.JWT_TOKEN_PREFIX,
  JWT_SECRET: env.JWT_SECRET,
  JWT_EXPIRY: env.JWT_EXPIRY,

  TRANSACTION_AES_SECRET: env.TRANSACTION_AES_SECRET,
  PERMISSIONS_AES_SECRET: env.PERMISSIONS_AES_SECRET,

  CORS_ALLOWED_ORIGINS: [env.USER_CLIENT_URL, env.ADMIN_CLIENT_URL],

  MONGO_URL: env.MONGO_URL,
};

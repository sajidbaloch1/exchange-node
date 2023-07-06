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

  CORS_ALLOWED_ORIGINS: [env.USER_CLIENT_URL, env.ADMIN_CLIENT_URL],
};

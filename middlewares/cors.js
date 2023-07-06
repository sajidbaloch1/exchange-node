import { appConfig } from "../config/app.js";

export default function corsMiddleware(req, res, next) {
  if (appConfig?.CORS_ALLOWED_ORIGINS?.length) {
    next();
  }

  const origin = req.get("origin");

  // Check if the origin is in whitelist
  if (appConfig.CORS_ALLOWED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);

    res.header(
      "Access-Control-Allow-Methods",
      "GET, HEAD, PUT, PATCH, POST, DELETE"
    );

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    // Check if it's a preflight request
    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  }

  next();
}

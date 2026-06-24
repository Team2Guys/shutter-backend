import { env } from "#config/index.js";

const { FRONTEND_URL, DASHBOARD_URL, NODE_ENV } = env;

const whitelist = [FRONTEND_URL, DASHBOARD_URL];

if (NODE_ENV !== "production") {
  whitelist.push(
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
  );
}

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl, Postman, Apollo Sandbox) with no origin.
    if (!origin || whitelist.includes(origin)) return callback(null, true);
    return callback(new Error(`Origin "${origin}" not allowed by CORS.`));
  },
  credentials: true,
};

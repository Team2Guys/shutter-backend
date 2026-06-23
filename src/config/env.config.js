import dotenv from "dotenv";
import { cleanEnv, str, port, email, url, testOnly } from "envalid";

import { logger } from "#lib/index.js";

const envFile = process.env.NODE_ENV;
dotenv.config({ path: envFile });

const validators = {
  PORT: port({ devDefault: 3000, desc: "Port number" }),
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
    desc: "Environment type",
  }),
  
  BACKEND_URL: url({ desc: "Backend URL" }),
  FRONTEND_URL: url({ desc: "Frontend URL" }),

  DATABASE_URL: url({ desc: "Database Connection String" }),

  JWT_SECRET: str({
    devDefault: testOnly("test-secret"),
    desc: "JWT secret key",
  }),

  EMAIL_HOST: str({ desc: "Email host" }),
  EMAIL_PORT: port({ desc: "Email port" }),
  USER_EMAIL: email({ desc: "Email address" }),
  USER_PASSWORD: str({ desc: "Email password" }),
};

export const env = cleanEnv(process.env, validators, {
  reporter: ({ errors }) => {
    const invalidVars = Object.keys(errors);
    if (invalidVars.length > 0) {
      logger.error(`Invalid ENV variables: ${invalidVars}`);
      process.exit(1);
    }
  },
});
